// ChatPage.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { modelConfigs } from '../../modelConfigs';
import ConfigPanel from './ConfigPanel';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentAssistantMessage, setCurrentAssistantMessage] = useState<string>('');

  // Configuration state
  const [selectedModel, setSelectedModel] = useState<string>(Object.keys(modelConfigs)[0]);
  const [system, setSystem] = useState<string>('');
  const [maxTokens, setMaxTokens] = useState<number>(1000);
  const [temperature, setTemperature] = useState<number>(0.7);
  const [topP, setTopP] = useState<number>(0.9);
  const [presencePenalty, setPresencePenalty] = useState<number>(0);
  const [frequencyPenalty, setFrequencyPenalty] = useState<number>(0);
  const [maxInputCharacters, setMaxInputCharacters] = useState<number>(4000);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, currentAssistantMessage]);

  const truncateMessages = (messages: Message[]): Message[] => {
    let totalChars = 0;
    const truncatedMessages: Message[] = [];

    // Start from the end of the array and work backwards
    for (let i = messages.length - 1; i >= 0; i--) {
      const message = messages[i];
      const messageChars = message.content.length;

      // If adding this message would exceed the limit, stop here
      if (totalChars + messageChars > maxInputCharacters) {
        break;
      }

      // Add this message to the front of the array
      truncatedMessages.unshift(message);
      totalChars += messageChars;

      // If we've just added a user message and it's not the first message, we're done
      if (message.role === 'user' && truncatedMessages.length > 1) {
        break;
      }
    }

    // If the first message is not from the user, remove messages until it is
    while (truncatedMessages.length > 0 && truncatedMessages[0].role !== 'user') {
      truncatedMessages.shift();
    }

    return truncatedMessages;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    setError(null);

    const userMessage: Message = { role: 'user', content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setCurrentAssistantMessage('');

    const modelConfig = modelConfigs[selectedModel];
    const truncatedMessages = truncateMessages(updatedMessages);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: truncatedMessages,
          model: modelConfig.provider,
          modelName: selectedModel,
          system,
          maxTokens,
          temperature,
          topP,
          presencePenalty,
          frequencyPenalty,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Response body is not readable');
      }

      let assistantMessage = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = new TextDecoder().decode(value);
        assistantMessage += chunk;
        setCurrentAssistantMessage(assistantMessage);
      }

      setMessages(prevMessages => [
        ...prevMessages,
        { role: 'assistant', content: assistantMessage },
      ]);
      setCurrentAssistantMessage('');
    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // ... rest of the component remains the same

  return (
    <div className="flex h-screen">
      <ConfigPanel
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
        system={system}
        setSystem={setSystem}
        maxTokens={maxTokens}
        setMaxTokens={setMaxTokens}
        temperature={temperature}
        setTemperature={setTemperature}
        topP={topP}
        setTopP={setTopP}
        presencePenalty={presencePenalty}
        setPresencePenalty={setPresencePenalty}
        frequencyPenalty={frequencyPenalty}
        setFrequencyPenalty={setFrequencyPenalty}
        maxInputCharacters={maxInputCharacters}
        setMaxInputCharacters={setMaxInputCharacters}
      />

      {/* Chat area */}
      <div className="flex-1 flex flex-col p-4">
        <div className="flex-1 overflow-y-auto mb-4">
          {messages.map((m, index) => (
            <div key={index} className={`mb-4 ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
              <span className={`inline-block p-2 rounded-lg ${m.role === 'user' ? 'bg-gray-300 text-black' : 'bg-gray-200 text-black'}`}>
                {m.content}
              </span>
            </div>
          ))}
          {currentAssistantMessage && (
            <div className="mb-4 text-left">
              <span className="inline-block p-2 rounded-lg bg-gray-200 text-black">
                {currentAssistantMessage}
              </span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        {isLoading && !currentAssistantMessage && <div className="mb-2">AI is thinking...</div>}
        {error && <div className="text-red-500 mb-2">Error: {error}</div>}
        <form onSubmit={handleSubmit} className="flex">
          <input
            className="flex-1 border border-gray-300 rounded-l-md p-2"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message here..."
          />
          <button 
            type="submit" 
            className="bg-gray-500 text-white rounded-r-md px-4 py-2"
            disabled={isLoading}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChatPage;
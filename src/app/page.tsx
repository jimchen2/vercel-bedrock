'use client';

import { useState, useRef, useEffect } from 'react';

export default function ChatPage() {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentAssistantMessage, setCurrentAssistantMessage] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, currentAssistantMessage]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    setError(null);

    const userMessage = { role: 'user', content: input };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput('');
    setCurrentAssistantMessage('');

    try {
      const response = await fetch('/api/generate/streamtext', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: input }),
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

  return (
    <div className="flex flex-col h-screen max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">AI Chat</h1>
      <div className="flex-1 overflow-y-auto mb-4">
        {messages.map((m, index) => (
          <div key={index} className={`mb-4 ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
            <span className={`inline-block p-2 rounded-lg ${m.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
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
          disabled={isLoading}
        />
        <button 
          type="submit" 
          className="bg-blue-500 text-white rounded-r-md px-4 py-2"
          disabled={isLoading}
        >
          Send
        </button>
      </form>
    </div>
  );
}

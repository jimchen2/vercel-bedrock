// Chat.tsx
import React, { useEffect, useRef } from "react";
import { marked } from "marked";
import "./markdownStyles.css";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatProps {
  messages: Message[];
  currentAssistantMessage: string;
  isLoading: boolean;
  error: string | null;
  input: string;
  setInput: (input: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

const Chat: React.FC<ChatProps> = ({ messages, currentAssistantMessage, isLoading, error, input, setInput, handleSubmit, messagesEndRef }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const renderMarkdown = (content: string) => {
    return { __html: marked(content) };
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex flex-col overflow-x-hidden h-full">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((m, index) => (
          <div key={index} className={`mb-4 ${m.role === "user" ? "text-right" : "text-left"}`}>
            {m.role === "user" ? (
              <span className="inline-block p-2 rounded-lg bg-gray-300 text-black">{m.content}</span>
            ) : (
              <div className="inline-block p-2 rounded-lg bg-gray-200 text-black markdown-content" dangerouslySetInnerHTML={renderMarkdown(m.content) as { __html: string }} />
            )}
          </div>
        ))}
        {currentAssistantMessage && (
          <div className="mb-4 text-left">
            <div className="inline-block p-2 rounded-lg bg-gray-200 text-black markdown-content" dangerouslySetInnerHTML={renderMarkdown(currentAssistantMessage) as { __html: string }} />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      {isLoading && !currentAssistantMessage && <div className="p-4">AI is thinking...</div>}
      {error && <div className="text-red-500 p-4">Error: {error}</div>}
      <form onSubmit={handleSubmit} className="flex p-4 border-t border-gray-200">
        <textarea
          ref={textareaRef}
          className="flex-1 border border-gray-300 rounded-l-md p-2 resize-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message here... (Shift+Enter for new line)"
          rows={1}
        />
        <button type="submit" className="bg-gray-500 text-white rounded-r-sm px-4 py-2" disabled={isLoading}>
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;
// Chat.tsx
import React, { useEffect, useRef } from "react";

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
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Autofocus on the input field when the component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div className="flex-1 flex flex-col p-4">
      <div className="flex-1 overflow-y-auto mb-4">
        {messages.map((m, index) => (
          <div key={index} className={`mb-4 ${m.role === "user" ? "text-right" : "text-left"}`}>
            <span className={`inline-block p-2 rounded-lg ${m.role === "user" ? "bg-gray-300 text-black" : "bg-gray-200 text-black"}`}>{m.content}</span>
          </div>
        ))}
        {currentAssistantMessage && (
          <div className="mb-4 text-left">
            <span className="inline-block p-2 rounded-lg bg-gray-200 text-black">{currentAssistantMessage}</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      {isLoading && !currentAssistantMessage && <div className="mb-2">AI is thinking...</div>}
      {error && <div className="text-red-500 mb-2">Error: {error}</div>}
      <form onSubmit={handleSubmit} className="flex">
        <input ref={inputRef} className="flex-1 border border-gray-300 rounded-l-md p-2" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type your message here..." />
        <button type="submit" className="bg-gray-500 text-white rounded-r-md px-4 py-2" disabled={isLoading}>
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;

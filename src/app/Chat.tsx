// Chat.tsx
import React, { useEffect, useRef, useState } from "react";
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
  const inputRef = useRef<HTMLInputElement>(null);
  const [copiedStates, setCopiedStates] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const renderMarkdown = (content: string) => {
    return { __html: marked(content) };
  };

  const copyToClipboard = (content: string, index: number) => {
    navigator.clipboard
      .writeText(content)
      .then(() => {
        setCopiedStates((prev) => ({ ...prev, [index]: true }));
        setTimeout(() => {
          setCopiedStates((prev) => ({ ...prev, [index]: false }));
        }, 2000);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  return (
    <div className="flex flex-col overflow-x-hidden h-full">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((m, index) => (
          <div key={index} className={`mb-4 ${m.role === "user" ? "text-right" : "text-left"}`}>
            {m.role === "user" ? (
              <span className="inline-block p-2 rounded-lg bg-gray-300 text-black">{m.content}</span>
            ) : (
              <div className="relative">
                <div className="inline-block p-2 rounded-lg bg-gray-200 text-black markdown-content" dangerouslySetInnerHTML={renderMarkdown(m.content) as { __html: string }} />
                <button onClick={() => copyToClipboard(m.content, index)} className="absolute top-0 right-0 bg-gray-500 text-white rounded-full p-3 text-md" title="Copy markdown">
                  {copiedStates[index] ? "Copied" : "Copy"}
                </button>
              </div>
            )}
          </div>
        ))}
        {currentAssistantMessage && (
          <div className="mb-4 text-left">
            <div className="relative">
              <div className="inline-block p-2 rounded-lg bg-gray-200 text-black markdown-content" dangerouslySetInnerHTML={renderMarkdown(m.content) as { __html: string }} />
              <button
                onClick={() => copyToClipboard(currentAssistantMessage, messages.length)}
                className="absolute top-0 right-0 bg-blue-500 text-white rounded-full p-1.5 text-sm"
                title="Copy markdown"
              >
                {copiedStates[messages.length] ? "Copied" : "Copy"}
              </button>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      {isLoading && !currentAssistantMessage && <div className="p-4">AI is thinking...</div>}
      {error && <div className="text-red-500 p-4">Error: {error}</div>}
      <form onSubmit={handleSubmit} className="flex p-4 border-t border-gray-200">
        <input ref={inputRef} className="flex-1 border border-gray-300 rounded-l-md p-2" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type your message here..." />
        <button type="submit" className="bg-gray-500 text-white rounded-r-sm px-4 py-2" disabled={isLoading}>
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;

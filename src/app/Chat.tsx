// Chat.tsx
import React, { useEffect, useRef, useState } from "react";
import { marked } from "marked";
import "./markdownStyles.css";
import { createRoot } from "react-dom/client";

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

const CopyButton: React.FC<{ text: string }> = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button onClick={handleCopy} className="absolute top-2 right-2 bg-black text-white px-2 py-1 rounded text-sm">
      {copied ? "Copied" : "Copy"}
    </button>
  );
};

const Chat: React.FC<ChatProps> = ({ messages, currentAssistantMessage, isLoading, error, input, setInput, handleSubmit, messagesEndRef }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (contentRef.current) {
      const codeBlocks = contentRef.current.querySelectorAll("pre code");
      codeBlocks.forEach((block, index) => {
        const container = document.createElement("div");
        container.className = "relative";
        block.parentNode?.insertBefore(container, block);
        container.appendChild(block);

        const copyButtonContainer = document.createElement("div");
        copyButtonContainer.className = "copy-button-container";
        copyButtonContainer.dataset.code = block.textContent || "";
        container.appendChild(copyButtonContainer);

        const root = createRoot(copyButtonContainer);
        root.render(<CopyButton text={block.textContent || ""} />);
      });
    }
  }, [messages]);

  const renderMarkdown = (content: string) => {
    return { __html: marked(content) };
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex flex-col overflow-x-hidden h-full">
      <div ref={contentRef} className="flex-1 overflow-y-auto p-4">
        {messages.map((m, index) => (
          <div key={index} className={`mb-4`}>
            {m.role === "user" ? (
              <div className="bg-gray-300 p-2 rounded-lg">
                <code className="block whitespace-pre-wrap break-words text-black">{m.content}</code>
              </div>
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
      </div>
      {isLoading && !currentAssistantMessage && <div className="p-4">AI is thinking...</div>}
      {error && <div className="text-red-500 p-4 whitespace-pre-wrap break-words">Error: {error}</div>}
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

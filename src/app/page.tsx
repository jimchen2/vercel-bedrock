// ChatPage.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import { modelConfigs } from "../../modelConfigs";
import ConfigPanel from "./ConfigPanel";
import Chat from "./Chat";
import { handleSubmit } from "./chatUtils";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentAssistantMessage, setCurrentAssistantMessage] = useState<string>("");

  // Configuration state
  const [selectedModel, setSelectedModel] = useState<string>(Object.keys(modelConfigs)[0]);
  const [system, setSystem] = useState<string>("");
  const [maxTokens, setMaxTokens] = useState<number>(1000);
  const [temperature, setTemperature] = useState<number>(0.7);
  const [topP, setTopP] = useState<number>(0.9);
  const [topK, setTopK] = useState<number>(50); // Added topK state
  const [presencePenalty, setPresencePenalty] = useState<number>(0);
  const [frequencyPenalty, setFrequencyPenalty] = useState<number>(0);
  const [maxInputCharacters, setMaxInputCharacters] = useState<number>(4000);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, currentAssistantMessage]);

  const onSubmit = (e: React.FormEvent) => {
    handleSubmit(e, {
      input,
      messages,
      selectedModel,
      system,
      maxTokens,
      temperature,
      topP,
      topK, 
      presencePenalty,
      frequencyPenalty,
      maxInputCharacters,
      setMessages,
      setInput,
      setCurrentAssistantMessage,
      setIsLoading,
      setError,
    });
  };

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
        topK={topK}
        setTopK={setTopK}
        presencePenalty={presencePenalty}
        setPresencePenalty={setPresencePenalty}
        frequencyPenalty={frequencyPenalty}
        setFrequencyPenalty={setFrequencyPenalty}
        maxInputCharacters={maxInputCharacters}
        setMaxInputCharacters={setMaxInputCharacters}
      />
      <Chat
        messages={messages}
        currentAssistantMessage={currentAssistantMessage}
        isLoading={isLoading}
        error={error}
        input={input}
        setInput={setInput}
        handleSubmit={onSubmit}
        messagesEndRef={messagesEndRef}
      />
    </div>
  );
};

export default ChatPage;

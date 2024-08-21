// src/components/chatUtils.ts
import { modelConfigs } from "../../modelConfigs";
import { getApiKey } from './auth';

interface Message {
  role: "user" | "assistant";
  content: string;
}

const truncateMessages = (messages: Message[], maxInputCharacters: number): Message[] => {
  let totalChars = 0;
  const truncatedMessages: Message[] = [];

  for (let i = messages.length - 1; i >= 0; i--) {
    const message = messages[i];
    const messageChars = message.content.length;

    if (totalChars + messageChars > maxInputCharacters) {
      break;
    }

    truncatedMessages.unshift(message);
    totalChars += messageChars;

    if (message.role === "user" && truncatedMessages.length > 1) {
      break;
    }
  }

  while (truncatedMessages.length > 0 && truncatedMessages[0].role !== "user") {
    truncatedMessages.shift();
  }

  return truncatedMessages;
};

export const handleSubmit = async (
  e: React.FormEvent,
  {
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
  }: {
    input: string;
    messages: Message[];
    selectedModel: string;
    system: string;
    maxTokens: number;
    temperature: number;
    topP: number;
    topK: number;
    presencePenalty: number;
    frequencyPenalty: number;
    maxInputCharacters: number;
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
    setInput: React.Dispatch<React.SetStateAction<string>>;
    setCurrentAssistantMessage: React.Dispatch<React.SetStateAction<string>>;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    setError: React.Dispatch<React.SetStateAction<string | null>>;
  }
) => {
  e.preventDefault();
  if (!input.trim()) return;

  setIsLoading(true);
  setError(null);

  const userMessage: Message = { role: "user", content: input };
  const updatedMessages = [...messages, userMessage];
  setMessages(updatedMessages);
  setInput("");
  setCurrentAssistantMessage("");

  const modelConfig = modelConfigs[selectedModel];
  const truncatedMessages = truncateMessages(updatedMessages, maxInputCharacters);

  // Get the API key using the getApiKey function
  const apiKey = getApiKey();

  if (!apiKey) {
    setError("API key not found. Please set the API key in the configuration panel.");
    setIsLoading(false);
    return;
  }

  try {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        messages: truncatedMessages,
        model: modelConfig.provider,
        modelName: selectedModel,
        system,
        maxTokens,
        temperature,
        topP,
        topK,
        presencePenalty,
        frequencyPenalty,
      }),
    });

    if (response.status === 401) {
      setError("Unauthorized. Please check your API key.");
      setIsLoading(false);
      return;
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error("Response body is not readable");
    }

    let assistantMessage = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = new TextDecoder().decode(value);
      assistantMessage += chunk;
      setCurrentAssistantMessage(assistantMessage);
    }

    setMessages((prevMessages) => [...prevMessages, { role: "assistant", content: assistantMessage }]);
    setCurrentAssistantMessage("");
  } catch (err) {
    console.error("Error:", err);
    setError(err instanceof Error ? err.message : "An error occurred");
  } finally {
    setIsLoading(false);
  }
};
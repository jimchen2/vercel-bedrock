// src/components/ConfigPanel.tsx
import React, { useState, useEffect } from "react";
import { modelConfigs } from "../../modelConfigs";
import { login } from "./auth";
import Cookies from "js-cookie";

interface ConfigPanelProps {
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  system: string;
  setSystem: (system: string) => void;
  maxTokens: number;
  setMaxTokens: (tokens: number) => void;
  temperature: number;
  setTemperature: (temp: number) => void;
  topP: number;
  setTopP: (topP: number) => void;
  topK: number;
  setTopK: (topK: number) => void;
  presencePenalty: number;
  setPresencePenalty: (penalty: number) => void;
  frequencyPenalty: number;
  setFrequencyPenalty: (penalty: number) => void;
  maxInputCharacters: number;
  setMaxInputCharacters: (chars: number) => void;
}

const defaultConfig = {
  selectedModel: "",
  system: "",
  maxTokens: 2048,
  temperature: 0.7,
  topP: 1,
  topK: 40,
  presencePenalty: 0,
  frequencyPenalty: 0,
  maxInputCharacters: 4000,
};

const ConfigPanel: React.FC<ConfigPanelProps> = (props) => {
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Load preferences from cookies
    const savedConfig = Cookies.get("userConfig");
    if (savedConfig) {
      const parsedConfig = JSON.parse(savedConfig);
      props.setSelectedModel(parsedConfig.selectedModel);
      props.setSystem(parsedConfig.system);
      props.setMaxTokens(parsedConfig.maxTokens);
      props.setTemperature(parsedConfig.temperature);
      props.setTopP(parsedConfig.topP);
      props.setTopK(parsedConfig.topK);
      props.setPresencePenalty(parsedConfig.presencePenalty);
      props.setFrequencyPenalty(parsedConfig.frequencyPenalty);
      props.setMaxInputCharacters(parsedConfig.maxInputCharacters);
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      // Save preferences to cookies whenever they change
      const currentConfig = {
        selectedModel: props.selectedModel,
        system: props.system,
        maxTokens: props.maxTokens,
        temperature: props.temperature,
        topP: props.topP,
        topK: props.topK,
        presencePenalty: props.presencePenalty,
        frequencyPenalty: props.frequencyPenalty,
        maxInputCharacters: props.maxInputCharacters,
      };
      Cookies.set("userConfig", JSON.stringify(currentConfig), { 
        expires: 365,
        sameSite: 'Strict',
        secure: window.location.protocol === 'https:'
      });
    }
  }, [isInitialized, props]);

  const handleSetApiKey = () => {
    if (apiKey) {
      login(apiKey);
      setShowApiKeyInput(false);
      setApiKey("");
      alert("API key has been set successfully!");
    }
  };

  const resetToDefaults = () => {
    props.setSelectedModel(defaultConfig.selectedModel);
    props.setSystem(defaultConfig.system);
    props.setMaxTokens(defaultConfig.maxTokens);
    props.setTemperature(defaultConfig.temperature);
    props.setTopP(defaultConfig.topP);
    props.setTopK(defaultConfig.topK);
    props.setPresencePenalty(defaultConfig.presencePenalty);
    props.setFrequencyPenalty(defaultConfig.frequencyPenalty);
    props.setMaxInputCharacters(defaultConfig.maxInputCharacters);
  };

  const renderInput = (label: string, value: number, setter: (value: number) => void, type = "number", step = "0.1", min = "0", max = "1") => (
    <div className="mb-1">
      <label className="text-md text-normal block">{label}</label>
      <input type={type} value={value} onChange={(e) => setter(Number(e.target.value))} step={step} min={min} max={max} className="w-full p-0.5 border rounded text-md bg-gray-50" />
    </div>
  );

  return (
    <div className="w-1/6 p-1 bg-gray-100 overflow-y-auto text-md">
      <h2 className="text-md font-bold mb-1">Config</h2>
      <div className="space-y-1">
        <div>
          <label className="text-md text-normal block">Model</label>
          <select value={props.selectedModel} onChange={(e) => props.setSelectedModel(e.target.value)} className="w-full p-0.5 border rounded text-sm bg-gray-50">
            {Object.keys(modelConfigs).map((modelName) => (
              <option key={modelName} value={modelName}>
                {modelName}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-md text-normal block">System</label>
          <textarea value={props.system} onChange={(e) => props.setSystem(e.target.value)} className="w-full p-0.5 border rounded text-md bg-gray-50" rows={2} />
        </div>
        {renderInput("Max Tokens", props.maxTokens, props.setMaxTokens, "number", "1", "1")}
        {renderInput("Temperature", props.temperature, props.setTemperature)}
        {renderInput("Top P", props.topP, props.setTopP)}
        {renderInput("Top K", props.topK, props.setTopK, "number", "1", "1")}
        {renderInput("Presence Penalty", props.presencePenalty, props.setPresencePenalty, "number", "0.1", "-2", "2")}
        {renderInput("Freq Penalty", props.frequencyPenalty, props.setFrequencyPenalty, "number", "0.1", "-2", "2")}
        {renderInput("Max Input Characters", props.maxInputCharacters, props.setMaxInputCharacters, "number", "1", "1")}
        <div>
          <button onClick={() => setShowApiKeyInput(!showApiKeyInput)} className="w-full p-0.5 bg-gray-300 text-gray-800 rounded text-md hover:bg-gray-400">
            {showApiKeyInput ? "Hide Key" : "Set Key"}
          </button>
          {showApiKeyInput && (
            <div className="mt-1">
              <input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="API Key" className="w-full p-0.5 border rounded text-md bg-gray-50" />
              <button onClick={handleSetApiKey} className="w-full mt-1 p-0.5 bg-gray-300 text-gray-800 rounded text-md hover:bg-gray-400">
                Save Key
              </button>
            </div>
          )}
        </div>
        <div>
          <button onClick={resetToDefaults} className="w-full p-0.5 bg-gray-300 text-gray-800 rounded text-md hover:bg-gray-400">
            Reset to Defaults
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfigPanel;
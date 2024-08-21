// ConfigPanel.tsx
import React from 'react';
import { modelConfigs } from '../../modelConfigs';

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
  presencePenalty: number;
  setPresencePenalty: (penalty: number) => void;
  frequencyPenalty: number;
  setFrequencyPenalty: (penalty: number) => void;
  maxInputCharacters: number;
  setMaxInputCharacters: (chars: number) => void;
}

const ConfigPanel: React.FC<ConfigPanelProps> = ({
  selectedModel,
  setSelectedModel,
  system,
  setSystem,
  maxTokens,
  setMaxTokens,
  temperature,
  setTemperature,
  topP,
  setTopP,
  presencePenalty,
  setPresencePenalty,
  frequencyPenalty,
  setFrequencyPenalty,
  maxInputCharacters,
  setMaxInputCharacters
}) => {
  return (
    <div className="w-1/4 p-4 bg-gray-100 overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">Configuration</h2>
      <div className="space-y-4">
        <div>
          <label className="block mb-1">Model</label>
          <select 
            value={selectedModel} 
            onChange={(e) => setSelectedModel(e.target.value)}
            className="w-full p-2 border rounded"
          >
            {Object.keys(modelConfigs).map((modelName) => (
              <option key={modelName} value={modelName}>
                {modelName}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1">System Prompt</label>
          <textarea 
            value={system} 
            onChange={(e) => setSystem(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-1">Max Tokens</label>
          <input 
            type="number" 
            value={maxTokens} 
            onChange={(e) => setMaxTokens(Number(e.target.value))}
            min="1"
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-1">Temperature</label>
          <input 
            type="number" 
            value={temperature} 
            onChange={(e) => setTemperature(Number(e.target.value))}
            step="0.1"
            min="0"
            max="1"
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-1">Top P</label>
          <input 
            type="number" 
            value={topP} 
            onChange={(e) => setTopP(Number(e.target.value))}
            step="0.1"
            min="0"
            max="1"
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-1">Presence Penalty</label>
          <input 
            type="number" 
            value={presencePenalty} 
            onChange={(e) => setPresencePenalty(Number(e.target.value))}
            step="0.1"
            min="-2"
            max="2"
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-1">Frequency Penalty</label>
          <input 
            type="number" 
            value={frequencyPenalty} 
            onChange={(e) => setFrequencyPenalty(Number(e.target.value))}
            step="0.1"
            min="-2"
            max="2"
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-1">Max Input Characters</label>
          <input 
            type="number" 
            value={maxInputCharacters} 
            onChange={(e) => setMaxInputCharacters(Number(e.target.value))}
            min="1"
            className="w-full p-2 border rounded"
          />
        </div>
      </div>
    </div>
  );
}

export default ConfigPanel;
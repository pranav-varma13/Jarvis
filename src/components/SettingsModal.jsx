import React, { useState } from 'react';
import { useJarvis } from '../context/JarvisContext';
import { X, Save } from 'lucide-react';

const SettingsModal = ({ onClose }) => {
    const { settings, updateSettings } = useJarvis();
    const [localSettings, setLocalSettings] = useState(settings);

    const handleSave = () => {
        updateSettings(localSettings);
        onClose();
    };

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="glass w-full max-w-md p-6 m-4 border-cyan-500/20 shadow-[0_0_50px_rgba(8,145,178,0.1)]">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-cyan-400 tracking-wider">SYSTEM CONFIG</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-white">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                            LLM Endpoint URL
                        </label>
                        <input
                            type="text"
                            value={localSettings.llmUrl}
                            onChange={(e) => setLocalSettings({ ...localSettings, llmUrl: e.target.value })}
                            className="w-full bg-black/40 border border-gray-700 rounded-lg p-3 text-cyan-100 focus:border-cyan-500/50 focus:outline-none font-mono text-sm"
                            placeholder="http://localhost:11434/v1/chat/completions"
                        />
                        <p className="text-[10px] text-gray-500 mt-1">
                            Compatible with Ollama or any OpenAI-format API.
                        </p>
                    </div>
                </div>

                <div className="mt-8 flex justify-end">
                    <button
                        onClick={handleSave}
                        className="flex items-center space-x-2 bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-400 px-6 py-2 rounded-lg border border-cyan-500/50 transition-all uppercase text-xs font-bold tracking-widest"
                    >
                        <Save className="w-4 h-4" />
                        <span>Save Configuration</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;

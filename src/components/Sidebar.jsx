import React, { useState } from 'react';
import { useJarvis } from '../context/JarvisContext';
import { Settings, Database, Cpu, Plus, Send } from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = ({ onOpenSettings }) => {
    const { trainJarvis, isProcessing } = useJarvis();
    const [memoryInput, setMemoryInput] = useState('');
    const [showMemoryInput, setShowMemoryInput] = useState(false);

    const handleTrain = async () => {
        if (!memoryInput.trim()) return;
        const success = await trainJarvis(memoryInput);
        if (success) {
            setMemoryInput('');
            setShowMemoryInput(false);
            // Optional: Show success toast
        }
    };

    return (
        <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="glass w-80 h-full flex flex-col p-6 space-y-8 hidden md:flex"
        >
            <div className="flex items-center space-x-3 text-accent pixel-font">
                <Cpu className="w-8 h-8 text-cyan-400 glow-text" />
                <h1 className="text-3xl font-bold tracking-widest text-cyan-50 glow-text">JARVIS</h1>
            </div>

            <div className="flex-1 space-y-6">
                <div>
                    <h2 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wider flex items-center">
                        <Database className="w-4 h-4 mr-2" />
                        Knowledge Base
                    </h2>

                    <button
                        onClick={() => setShowMemoryInput(!showMemoryInput)}
                        className="w-full py-3 px-4 glass hover:bg-white/10 transition-all rounded-lg flex items-center justify-center space-x-2 text-cyan-300 border border-cyan-500/30"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add Memory</span>
                    </button>

                    {showMemoryInput && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            className="mt-4 space-y-2 overflow-hidden"
                        >
                            <textarea
                                value={memoryInput}
                                onChange={(e) => setMemoryInput(e.target.value)}
                                placeholder="Teach me something..."
                                className="w-full bg-black/40 border border-gray-700 rounded-lg p-3 text-sm focus:border-cyan-500 focus:outline-none resize-none custom-scrollbar text-gray-300"
                                rows={4}
                            />
                            <button
                                onClick={handleTrain}
                                disabled={isProcessing}
                                className="w-full py-2 bg-cyan-600/20 hover:bg-cyan-600/40 text-cyan-400 text-xs rounded border border-cyan-500/50 uppercase tracking-widest transition-colors"
                            >
                                {isProcessing ? 'Ingesting...' : 'Upload to Core'}
                            </button>
                        </motion.div>
                    )}
                </div>
            </div>

            <div className="pt-4 border-t border-gray-800">
                <button
                    onClick={onOpenSettings}
                    className="flex items-center space-x-3 text-gray-400 hover:text-cyan-400 transition-colors w-full p-2 rounded-lg hover:bg-white/5"
                >
                    <Settings className="w-5 h-5" />
                    <span>System Settings</span>
                </button>
            </div>
        </motion.div>
    );
};

export default Sidebar;

import React, { useState, useRef, useEffect } from 'react';
import { useJarvis } from '../context/JarvisContext';
import { Send, User, Bot, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';

const ChatInterface = () => {
    const { messages, sendMessage, isProcessing } = useJarvis();
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!input.trim() || isProcessing) return;
        sendMessage(input);
        setInput('');
    };

    return (
        <div className="flex-1 glass flex flex-col overflow-hidden relative">
            {/* Header/Status Bar could go here */}

            <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
                <AnimatePresence>
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-[80%] flex space-x-3 ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-cyan-600/20 text-cyan-400 border border-cyan-500/50' : 'bg-red-500/10 text-red-400 border border-red-500/30'
                                    }`}>
                                    {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                                </div>

                                <div className={`p-4 rounded-2xl border ${msg.role === 'user'
                                        ? 'bg-cyan-900/10 border-cyan-500/20 text-cyan-50 rounded-tr-none'
                                        : 'bg-gray-900/40 border-gray-700/50 text-gray-300 rounded-tl-none'
                                    }`}>
                                    <ReactMarkdown className="prose prose-invert prose-sm max-w-none">
                                        {msg.content}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {isProcessing && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex justify-start items-center space-x-2 p-2"
                    >
                        <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/30">
                            <Loader2 className="w-4 h-4 text-red-400 animate-spin" />
                        </div>
                        <span className="text-xs text-gray-500 animate-pulse">JARVIS IS THINKING...</span>
                    </motion.div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-gray-800/50 bg-black/20">
                <form onSubmit={handleSubmit} className="flex space-x-4">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Enter command..."
                        className="flex-1 bg-black/40 border border-gray-700 rounded-xl px-6 py-4 focus:outline-none focus:border-cyan-500/50 text-white placeholder-gray-600 transition-all"
                        disabled={isProcessing}
                    />
                    <button
                        type="submit"
                        disabled={isProcessing || !input.trim()}
                        className="bg-cyan-600/10 hover:bg-cyan-600/20 text-cyan-400 border border-cyan-500/50 p-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatInterface;

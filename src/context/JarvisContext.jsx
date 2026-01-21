import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { getEmbeddings } from '../services/embeddings';
import { queryPinecone, upsertVector } from '../services/pinecone';
import { chatWithLLM } from '../services/llm';

const JarvisContext = createContext();

export const useJarvis = () => useContext(JarvisContext);

export const JarvisProvider = ({ children }) => {
    const [messages, setMessages] = useState([
        { id: 'init-1', role: 'assistant', content: 'Hello, sir. How may I assist you today?' }
    ]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [settings, setSettings] = useState({
        llmUrl: localStorage.getItem('llm_url') || 'http://localhost:11434/v1/chat/completions',
        pineconeIndex: 'jarvis-memory'
    });

    const addMessage = (role, content) => {
        setMessages(prev => [...prev, { id: uuidv4(), role, content }]);
    };

    const trainJarvis = async (text) => {
        setIsProcessing(true);
        try {
            const vector = await getEmbeddings(text);
            const id = uuidv4(); // simplified ID
            await upsertVector(id, vector, text);
            return true;
        } catch (err) {
            console.error(err);
            return false;
        } finally {
            setIsProcessing(false);
        }
    };

    const sendMessage = async (text) => {
        addMessage('user', text);
        setIsProcessing(true);

        try {
            // 1. RAG: Get Embedding & Query Memory
            const queryVector = await getEmbeddings(text);
            const matches = await queryPinecone(queryVector);

            const contextText = matches
                .filter(m => m.score > 0.6) // Threshold
                .map(m => m.metadata?.text)
                .join('\n---\n');

            console.log("Retrieved Context:", contextText);

            // 2. Construct Prompt
            const systemPrompt = `You are Jarvis, a highly advanced AI assistant. 
      You are helpful, precise, and polite. 
      Use the following context to answer the user's question if relevant. 
      If the context doesn't help, answer from your own knowledge.
      
      Context:
      ${contextText}
      `;

            const llmMessages = [
                { role: 'system', content: systemPrompt },
                ...messages.map(m => ({ role: m.role, content: m.content })), // Include history
                { role: 'user', content: text }
            ];

            // 3. Call LLM
            const response = await chatWithLLM(llmMessages);
            addMessage('assistant', response);

        } catch (error) {
            console.error("Pipeline Error:", error);
            addMessage('assistant', "I apologize, sir. I encountered an internal error processing your request.");
        } finally {
            setIsProcessing(false);
        }
    };

    const updateSettings = (newSettings) => {
        setSettings(newSettings);
        if (newSettings.llmUrl) localStorage.setItem('llm_url', newSettings.llmUrl);
    };

    return (
        <JarvisContext.Provider value={{ messages, isProcessing, sendMessage, trainJarvis, settings, updateSettings }}>
            {children}
        </JarvisContext.Provider>
    );
};

import React, { useState } from 'react';
import { JarvisProvider } from './context/JarvisContext';
import ChatInterface from './components/ChatInterface';
import Sidebar from './components/Sidebar';
import SettingsModal from './components/SettingsModal';
import { motion } from 'framer-motion';

function App() {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <JarvisProvider>
      <div className="flex h-screen w-full text-white overflow-hidden p-4 gap-4 relative">
        <Sidebar onOpenSettings={() => setShowSettings(true)} />
        <ChatInterface />

        {showSettings && (
          <SettingsModal onClose={() => setShowSettings(false)} />
        )}
      </div>
    </JarvisProvider>
  );
}

export default App;

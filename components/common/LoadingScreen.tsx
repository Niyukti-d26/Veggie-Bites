import React, { useState, useEffect } from 'react';

const loadingMessages = [
    "Planting fresh ideas...",
    "Simmering pixels for recipe images...",
    "Consulting our AI chefs...",
    "Preheating the image generator...",
    "Sourcing the freshest visuals...",
    "Garnishing your digital cookbook..."
];

const LoadingScreen: React.FC = () => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setMessageIndex(prevIndex => (prevIndex + 1) % loadingMessages.length);
    }, 3000); // Change message every 3 seconds

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="h-screen flex flex-col items-center justify-center text-center -mt-24">
       <div className="bg-white/30 backdrop-blur-lg p-12 rounded-3xl shadow-2xl border border-white/20 flex flex-col items-center transition-all duration-500">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-emerald-500 mb-6"></div>
            <h2 className="text-2xl font-semibold text-gray-700">{loadingMessages[messageIndex]}</h2>
            <p className="text-gray-600 mt-2">Our AI is generating a beautiful cookbook for you. This may take a minute.</p>
       </div>
    </div>
  );
};

export default LoadingScreen;

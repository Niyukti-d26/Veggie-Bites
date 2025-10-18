import React, { useState } from 'react';
import { Cuisine, Recipe } from '../types';
import { generateRecipeWithAI } from '../services/geminiService';
import Spinner from './common/Spinner';

interface AIChatProps {
  cuisine: Cuisine;
  onRecipeGenerated: (recipe: Recipe) => void;
}

const AIChat: React.FC<AIChatProps> = ({ cuisine, onRecipeGenerated }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [ingredients, setIngredients] = useState('');
  const [image, setImage] = useState<{file: File, base64: string} | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toBase64 = (file: File) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        try {
            const base64 = await toBase64(file);
            setImage({ file, base64 });
        } catch (err) {
            console.error("Error converting file to base64", err);
            setError("Could not read image file.");
        }
    }
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const imageData = image ? {
        inlineData: {
            data: image.base64.split(',')[1],
            mimeType: image.file.type,
        }
      } : undefined;
      const newRecipe = await generateRecipeWithAI(cuisine.name, ingredients, imageData);
      onRecipeGenerated(newRecipe);
      setIsOpen(false);
      setIngredients('');
      setImage(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-br from-emerald-500 to-cyan-500 text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center transition-transform duration-300 hover:scale-110"
        aria-label="Open AI Recipe Generator"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-80 bg-white/70 backdrop-blur-lg rounded-2xl shadow-2xl p-4 border border-gray-200 z-40">
      <div className="flex justify-between items-center mb-3">
        <h4 className="font-bold text-gray-700">AI Recipe Generator</h4>
        <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
      </div>
      <p className="text-sm text-gray-600 mb-2">Generating for <span className="font-semibold text-emerald-600">{cuisine.name}</span> cuisine.</p>
      
      {image && (
          <div className="mt-2 relative">
            <img src={image.base64} alt="Selected ingredients" className="rounded-lg w-full h-24 object-cover" />
            <button onClick={() => setImage(null)} className="absolute top-1 right-1 bg-black/50 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs" aria-label="Remove image">
              &times;
            </button>
          </div>
      )}
      
      <div className="flex items-center gap-2 mt-2">
        <textarea
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          placeholder="Optional: list ingredients you have..."
          rows={image ? 1 : 3}
          className="w-full text-sm px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all duration-300"
        />
        <label htmlFor="image-upload" className="cursor-pointer text-gray-500 hover:text-emerald-600 p-3 rounded-full bg-gray-100 hover:bg-emerald-100 transition-colors" aria-label="Upload an image of your ingredients">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
        </label>
        <input id="image-upload" type="file" accept="image/*" className="hidden" onChange={handleImageSelect}/>
      </div>

      {error && <p className="text-xs text-red-500 mt-1 px-1">{error}</p>}
      
      <button
        onClick={handleGenerate}
        disabled={isLoading}
        className="w-full mt-2 bg-emerald-500 text-white font-bold py-2 px-4 rounded-full hover:bg-emerald-600 transition-colors duration-300 disabled:bg-gray-400 flex items-center justify-center"
      >
        {isLoading ? <Spinner /> : 'Generate Recipe'}
      </button>
    </div>
  );
};

export default AIChat;

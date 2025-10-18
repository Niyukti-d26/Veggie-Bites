import React, { useEffect } from 'react';
import { Cuisine } from '../types';
import Card from './common/Card';
import { generateImageWithAI } from '../services/geminiService';

interface CuisineListViewProps {
  cuisines: Cuisine[];
  onSelectCuisine: (cuisine: Cuisine) => void;
  onFusionClick: () => void;
  onImageGenerated: (cuisineId: number, imageUrl: string) => void;
}

const CuisineListView: React.FC<CuisineListViewProps> = ({ cuisines, onSelectCuisine, onFusionClick, onImageGenerated }) => {
  
  useEffect(() => {
    const generateImages = async () => {
      for (const cuisine of cuisines) {
        if (!cuisine.image) {
          try {
            const imageUrl = await generateImageWithAI(cuisine.name, 'cuisine');
            onImageGenerated(cuisine.id, imageUrl);
            await new Promise(resolve => setTimeout(resolve, 1000)); // Rate limiting
          } catch (error) {
            console.error(`Failed to generate image for ${cuisine.name}`, error);
          }
        }
      }
    };
    generateImages();
  }, []); // Run only on mount
  
  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-700 mb-4">Choose a Cuisine</h2>
        <button
          onClick={onFusionClick}
          className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold py-2 px-6 rounded-full transition-transform duration-300 hover:scale-105 shadow-lg"
          aria-label="Create a fusion recipe from two cuisines"
        >
          ✨ Create a Fusion Recipe
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
        {cuisines.map(cuisine => (
          <Card 
            key={cuisine.id} 
            onClick={() => onSelectCuisine(cuisine)}
            className="flex flex-col overflow-hidden"
          >
            {cuisine.image ? (
              <img src={cuisine.image} alt={cuisine.name} className="w-full h-40 object-cover" />
            ) : (
              <div className="w-full h-40 bg-gray-300 animate-pulse"></div>
            )}
            <div className="p-4 flex-grow flex flex-col justify-between">
              <h3 className="text-xl font-semibold text-center text-gray-800 mb-2">{cuisine.name}</h3>
              <p className="text-sm text-gray-600 text-center leading-tight">{cuisine.description}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CuisineListView;

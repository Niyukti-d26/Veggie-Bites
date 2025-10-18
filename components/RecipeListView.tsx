import React, { useEffect } from 'react';
import { Cuisine, Recipe } from '../types';
import Card from './common/Card';
import { generateImageWithAI } from '../services/geminiService';

interface RecipeListViewProps {
  cuisine: Cuisine;
  onSelectRecipe: (recipe: Recipe) => void;
  onAddRecipe: () => void;
  isLoggedIn: boolean;
  onRecipeUpdate: (recipeId: number, details: Partial<Recipe>) => void;
}

const RecipeListView: React.FC<RecipeListViewProps> = ({ cuisine, onSelectRecipe, onAddRecipe, isLoggedIn, onRecipeUpdate }) => {
  
  useEffect(() => {
    const generateRecipeImages = async () => {
      for (const recipe of cuisine.recipes) {
        if (!recipe.image) {
          try {
            const imageUrl = await generateImageWithAI(recipe.name, 'dish');
            onRecipeUpdate(recipe.id, { image: imageUrl });
            await new Promise(resolve => setTimeout(resolve, 1000)); // Rate limiting
          } catch (error) {
            console.error(`Failed to generate image for ${recipe.name}`, error);
          }
        }
      }
    };
    generateRecipeImages();
  }, [cuisine.id, cuisine.recipes, onRecipeUpdate]); // Re-run if cuisine changes
  
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-700">{cuisine.name} Recipes</h2>
        {isLoggedIn && (
          <button
            onClick={onAddRecipe}
            className="bg-emerald-500 text-white font-semibold py-2 px-5 rounded-full transition-colors duration-300 hover:bg-emerald-600 shadow-lg"
          >
            + Add Recipe
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
        {cuisine.recipes.map(recipe => (
          <Card key={recipe.id} onClick={() => onSelectRecipe(recipe)} className="flex flex-col overflow-hidden">
            {recipe.image ? (
              <img src={recipe.image} alt={recipe.name} className="w-full h-48 object-cover" />
            ) : (
              <div className="w-full h-48 bg-gray-300 animate-pulse"></div>
            )}
            <div className="p-4 flex-grow">
              <h3 className="text-lg font-semibold text-gray-800">{recipe.name}</h3>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RecipeListView;

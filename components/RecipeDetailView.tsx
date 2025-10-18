import React, { useEffect } from 'react';
import { Recipe } from '../types';
import Card from './common/Card';
import { getNutritionalInfo } from '../services/geminiService';

interface RecipeDetailViewProps {
  recipe: Recipe;
  onRecipeUpdate: (recipeId: number, details: Partial<Recipe>) => void;
}

const YoutubeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);


const RecipeDetailView: React.FC<RecipeDetailViewProps> = ({ recipe, onRecipeUpdate }) => {

  useEffect(() => {
    if (!recipe.nutrition) {
      getNutritionalInfo(recipe.ingredients).then(nutrition => {
        if (nutrition) {
          onRecipeUpdate(recipe.id, { nutrition });
        }
      });
    }
  }, [recipe.id, recipe.ingredients, recipe.nutrition, onRecipeUpdate]);

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="p-0 overflow-hidden" isHoverable={false}>
        <div className="grid md:grid-cols-2">
            <img src={recipe.image} alt={recipe.name} className="w-full h-64 md:h-full object-cover"/>
            <div className="p-6 md:p-8 flex flex-col">
                <div>
                    <h2 className="text-3xl font-bold mb-4 text-gray-800">{recipe.name}</h2>
                    <div className="mb-6">
                        <h3 className="text-xl font-semibold mb-2 text-emerald-600">Ingredients</h3>
                        <ul className="list-disc list-inside text-gray-700 space-y-1">
                            {recipe.ingredients.map((ingredient, index) => (
                            <li key={index}>{ingredient}</li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-3 text-emerald-600">Nutritional Info <span className="text-sm font-normal text-gray-500">(per serving)</span></h3>
                    {recipe.nutrition ? (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                            <div className="bg-emerald-50 p-2 rounded-lg">
                                <p className="font-bold text-md text-emerald-700">{recipe.nutrition.calories}</p>
                                <p className="text-xs text-gray-600">Calories</p>
                            </div>
                                <div className="bg-sky-50 p-2 rounded-lg">
                                <p className="font-bold text-md text-sky-700">{recipe.nutrition.protein}</p>
                                <p className="text-xs text-gray-600">Protein</p>
                            </div>
                                <div className="bg-amber-50 p-2 rounded-lg">
                                <p className="font-bold text-md text-amber-700">{recipe.nutrition.carbs}</p>
                                <p className="text-xs text-gray-600">Carbs</p>
                            </div>
                                <div className="bg-rose-50 p-2 rounded-lg">
                                <p className="font-bold text-md text-rose-700">{recipe.nutrition.fat}</p>
                                <p className="text-xs text-gray-600">Fat</p>
                            </div>
                        </div>
                    ) : (
                        <div className="p-2 rounded-lg bg-gray-200 animate-pulse h-20 flex items-center justify-center">
                            <p className="text-sm text-gray-500">Generating nutritional info...</p>
                        </div>
                    )}
                </div>
                 <a
                    href={recipe.youtubeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center bg-red-600 text-white font-semibold py-3 px-6 rounded-full transition-transform duration-300 hover:bg-red-700 hover:scale-105 shadow-lg mt-auto"
                    >
                    <YoutubeIcon />
                    Watch on YouTube
                </a>
            </div>
        </div>
        <div className="p-6 md:p-8 bg-white/50">
            <h3 className="text-xl font-semibold mb-3 text-emerald-600">Instructions</h3>
            <ol className="list-decimal list-inside text-gray-700 space-y-2">
                {recipe.instructions.map((instruction, index) => (
                <li key={index}>{instruction}</li>
                ))}
            </ol>
        </div>
      </Card>
    </div>
  );
};

export default RecipeDetailView;

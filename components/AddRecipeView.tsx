
import React, { useState } from 'react';
import { Recipe } from '../types';
import Card from './common/Card';

interface AddRecipeViewProps {
  onAddRecipe: (recipe: Omit<Recipe, 'id' | 'image' | 'nutrition'>, imageFile: File | null) => void;
}

const AddRecipeView: React.FC<AddRecipeViewProps> = ({ onAddRecipe }) => {
  const [name, setName] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [youtubeLink, setYoutubeLink] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecipe = {
      name,
      ingredients: ingredients.split('\n').filter(i => i.trim() !== ''),
      instructions: instructions.split('\n').filter(i => i.trim() !== ''),
      youtubeLink,
    };
    onAddRecipe(newRecipe, imageFile);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card isHoverable={false} className="p-8">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-700">Add Your Recipe</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Recipe Name"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
          <textarea
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            placeholder="Ingredients (one per line)"
            required
            rows={5}
            className="w-full px-4 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
          <textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="Instructions (one per line)"
            required
            rows={7}
            className="w-full px-4 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
          <input
            type="url"
            value={youtubeLink}
            onChange={(e) => setYoutubeLink(e.target.value)}
            placeholder="YouTube Video Link"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Recipe Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
            />
          </div>
          <button type="submit" className="w-full bg-emerald-500 text-white font-bold py-3 px-4 rounded-full hover:bg-emerald-600 transition-colors duration-300">
            Submit Recipe
          </button>
        </form>
      </Card>
    </div>
  );
};

export default AddRecipeView;

import React, { useState, useEffect, useCallback } from 'react';
import { View, Cuisine, Recipe } from './types';
import { initialCuisines } from './data/initialData';
import { generateFusionRecipe } from './services/geminiService';
import Header from './components/Header';
import LandingView from './components/LandingView';
import CuisineListView from './components/CuisineListView';
import RecipeListView from './components/RecipeListView';
import RecipeDetailView from './components/RecipeDetailView';
import AuthView from './components/AuthView';
import AddRecipeView from './components/AddRecipeView';
import BackButton from './components/common/BackButton';
import AIChat from './components/AIChat';
import Card from './components/common/Card';
import FusionModal from './components/FusionModal';

const App: React.FC = () => {
  const [viewStack, setViewStack] = useState<View[]>([View.LANDING]);
  const [cuisines, setCuisines] = useState<Cuisine[]>(initialCuisines);
  const [selectedCuisine, setSelectedCuisine] = useState<Cuisine | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<{username: string} | null>(null);
  
  const [newlyGeneratedRecipe, setNewlyGeneratedRecipe] = useState<Recipe | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [duplicateRecipe, setDuplicateRecipe] = useState<Recipe | null>(null);

  const [isFusionModalOpen, setIsFusionModalOpen] = useState<boolean>(false);
  const [isGeneratingFusion, setIsGeneratingFusion] = useState<boolean>(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('veggiebites_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsLoggedIn(true);
    }
  }, []);

  const updateCuisineImage = useCallback((cuisineId: number, imageUrl: string) => {
    setCuisines(prevCuisines =>
      prevCuisines.map(c =>
        c.id === cuisineId ? { ...c, image: imageUrl } : c
      )
    );
  }, []);

  const updateRecipeDetails = useCallback((recipeId: number, details: Partial<Recipe>) => {
    setCuisines(prevCuisines =>
      prevCuisines.map(cuisine => ({
        ...cuisine,
        recipes: cuisine.recipes.map(recipe =>
          recipe.id === recipeId ? { ...recipe, ...details } : recipe
        ),
      }))
    );

    // Also update selectedRecipe if it's the one being changed
    setSelectedRecipe(prevRecipe => 
      prevRecipe && prevRecipe.id === recipeId ? { ...prevRecipe, ...details } : prevRecipe
    );
  }, []);


  const handleLogin = (username: string) => {
    const newUser = { username };
    localStorage.setItem('veggiebites_user', JSON.stringify(newUser));
    setUser(newUser);
    setIsLoggedIn(true);
    goBack();
  };

  const handleLogout = () => {
    localStorage.removeItem('veggiebites_user');
    setUser(null);
    setIsLoggedIn(false);
  };
  
  const navigateTo = (view: View) => {
    setViewStack(prev => [...prev, view]);
  };
  
  const handleExplore = () => {
    setViewStack([View.CUISINE_LIST]);
  };

  const goBack = () => {
    if (viewStack.length > 1) {
      setViewStack(prev => prev.slice(0, -1));
    }
  };

  const handleSelectCuisine = (cuisine: Cuisine) => {
    setSelectedCuisine(cuisine);
    navigateTo(View.RECIPE_LIST);
  };

  const handleSelectRecipe = (recipe: Recipe) => {
    if(showConfirmModal || duplicateRecipe) {
       setShowConfirmModal(false);
       setDuplicateRecipe(null);
       setNewlyGeneratedRecipe(null);
    }
    setSelectedRecipe(recipe);
    navigateTo(View.RECIPE_DETAIL);
  };

  const handleAddRecipe = (newRecipe: Omit<Recipe, 'id' | 'image' | 'nutrition'>, imageFile: File | null) => {
    if (!selectedCuisine) return;
    
    const imageUrl = imageFile ? URL.createObjectURL(imageFile) : `https://source.unsplash.com/500x500/?vegetarian%20${newRecipe.name.split(' ').join('%20')}`;

    const recipeWithId: Recipe = {
      ...newRecipe,
      id: Date.now(),
      image: imageUrl,
    };

    const updatedCuisines = cuisines.map(c => {
      if (c.id === selectedCuisine.id) {
        return { ...c, recipes: [...c.recipes, recipeWithId] };
      }
      return c;
    });
    setCuisines(updatedCuisines);
    goBack();
  };
  
  const handleAIRecipeGenerated = useCallback((recipe: Recipe) => {
      setNewlyGeneratedRecipe(recipe);
      setShowConfirmModal(true);
  }, []);

  const handleConfirmAddRecipe = () => {
    if (!newlyGeneratedRecipe || !selectedCuisine) return;

    const existingRecipe = selectedCuisine.recipes.find(r => r.name.toLowerCase().trim() === newlyGeneratedRecipe.name.toLowerCase().trim());

    if (existingRecipe) {
        setDuplicateRecipe(existingRecipe);
        setShowConfirmModal(false);
        setNewlyGeneratedRecipe(null);
    } else {
        const updatedCuisines = cuisines.map(c => {
            if (c.id === selectedCuisine.id) {
                return { ...c, recipes: [...c.recipes, newlyGeneratedRecipe] };
            }
            return c;
        });
        setCuisines(updatedCuisines);
        const updatedSelectedCuisine = updatedCuisines.find(c => c.id === selectedCuisine.id);
        if(updatedSelectedCuisine) {
            setSelectedCuisine(updatedSelectedCuisine);
        }
        handleSelectRecipe(newlyGeneratedRecipe);
    }
  };
  
  const handleCancelAddRecipe = () => {
    setShowConfirmModal(false);
    setNewlyGeneratedRecipe(null);
  }

  const handleGenerateFusionRecipe = async (cuisine1: string, cuisine2: string) => {
    setIsGeneratingFusion(true);
    try {
      const fusionRecipe = await generateFusionRecipe(cuisine1, cuisine2);
      setIsFusionModalOpen(false);
      setSelectedRecipe(fusionRecipe);
      navigateTo(View.RECIPE_DETAIL);
    } catch (error) {
      console.error("Failed to generate fusion recipe", error);
      // Here you could implement an error modal for the user
    } finally {
      setIsGeneratingFusion(false);
    }
  };

  const currentView = viewStack[viewStack.length - 1];

  const renderView = () => {
    switch (currentView) {
      case View.LANDING:
        return <LandingView onExplore={handleExplore} />;
      case View.CUISINE_LIST:
        return <CuisineListView cuisines={cuisines} onSelectCuisine={handleSelectCuisine} onFusionClick={() => setIsFusionModalOpen(true)} onImageGenerated={updateCuisineImage} />;
      case View.RECIPE_LIST:
        return selectedCuisine && <RecipeListView cuisine={selectedCuisine} onSelectRecipe={handleSelectRecipe} onAddRecipe={() => navigateTo(View.ADD_RECIPE)} isLoggedIn={isLoggedIn} onRecipeUpdate={updateRecipeDetails} />;
      case View.RECIPE_DETAIL:
        return selectedRecipe && <RecipeDetailView recipe={selectedRecipe} onRecipeUpdate={updateRecipeDetails} />;
      case View.AUTH:
        return <AuthView onLogin={handleLogin} />;
       case View.ADD_RECIPE:
        return <AddRecipeView onAddRecipe={handleAddRecipe} />;
      default:
        return <LandingView onExplore={handleExplore} />;
    }
  };

  return (
    <div className="min-h-screen text-gray-800">
      <div 
        className="fixed inset-0 z-[-1] bg-cover bg-center transition-all duration-500"
        style={{backgroundImage: "url('https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2874&auto=format&fit=crop')", filter: 'blur(4px) brightness(0.9)'}}
      ></div>
      <div className="relative z-10">
        {currentView !== View.LANDING && <Header 
          isLoggedIn={isLoggedIn} 
          username={user?.username} 
          onLogout={handleLogout} 
          onAuthClick={() => navigateTo(View.AUTH)} 
        />}

        <main className={`container mx-auto px-4 py-8 ${currentView !== View.LANDING && 'pt-24'}`}>
          {renderView()}
        </main>
        
        {viewStack.length > 1 && currentView !== View.CUISINE_LIST && <BackButton onClick={goBack} />}
        
        {currentView === View.RECIPE_LIST && selectedCuisine && 
          <AIChat 
            cuisine={selectedCuisine} 
            onRecipeGenerated={handleAIRecipeGenerated}
          />
        }
        
        {isFusionModalOpen && (
          <FusionModal
            cuisines={cuisines}
            onClose={() => setIsFusionModalOpen(false)}
            onGenerate={handleGenerateFusionRecipe}
            isLoading={isGeneratingFusion}
          />
        )}

        {showConfirmModal && newlyGeneratedRecipe && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <Card isHoverable={false} className="w-full max-w-md p-6">
                    <h3 className="text-xl font-bold text-center mb-4">New Recipe Generated!</h3>
                    <img src={newlyGeneratedRecipe.image} alt={newlyGeneratedRecipe.name} className="w-full h-48 object-cover rounded-lg mb-4" />
                    <h4 className="text-lg font-semibold text-gray-800">{newlyGeneratedRecipe.name}</h4>
                    <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                        {newlyGeneratedRecipe.ingredients.join(', ')}
                    </p>
                    <div className="flex justify-between gap-4 mt-6">
                        <button onClick={handleCancelAddRecipe} className="w-full bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-full hover:bg-gray-400 transition-colors duration-300">
                            Discard
                        </button>
                        <button onClick={handleConfirmAddRecipe} className="w-full bg-emerald-500 text-white font-bold py-2 px-4 rounded-full hover:bg-emerald-600 transition-colors duration-300">
                            Add to Cookbook
                        </button>
                    </div>
                </Card>
            </div>
        )}
        
        {duplicateRecipe && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <Card isHoverable={false} className="w-full max-w-md p-6">
                    <h3 className="text-xl font-bold text-center mb-4 text-amber-600">Recipe Already Exists!</h3>
                     <img src={duplicateRecipe.image} alt={duplicateRecipe.name} className="w-full h-48 object-cover rounded-lg mb-4" />
                    <p className="text-center text-gray-700">
                        <span className="font-semibold">{duplicateRecipe.name}</span> is already in your {selectedCuisine?.name} cookbook.
                    </p>
                    <div className="flex justify-between gap-4 mt-6">
                        <button onClick={() => setDuplicateRecipe(null)} className="w-full bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-full hover:bg-gray-400 transition-colors duration-300">
                            Close
                        </button>
                        <button onClick={() => handleSelectRecipe(duplicateRecipe)} className="w-full bg-emerald-500 text-white font-bold py-2 px-4 rounded-full hover:bg-emerald-600 transition-colors duration-300">
                            View Recipe
                        </button>
                    </div>
                </Card>
            </div>
        )}

      </div>
    </div>
  );
};

export default App;

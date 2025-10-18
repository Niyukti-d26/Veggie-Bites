
import React, { useState } from 'react';
import { Cuisine } from '../types';
import Card from './common/Card';
import Spinner from './common/Spinner';

interface FusionModalProps {
  cuisines: Cuisine[];
  onClose: () => void;
  onGenerate: (cuisine1: string, cuisine2: string) => void;
  isLoading: boolean;
}

const FusionModal: React.FC<FusionModalProps> = ({ cuisines, onClose, onGenerate, isLoading }) => {
    const [selected, setSelected] = useState<string[]>([]);

    const handleSelect = (cuisineName: string) => {
        setSelected(prev => {
            if (prev.includes(cuisineName)) {
                return prev.filter(name => name !== cuisineName);
            }
            if (prev.length < 2) {
                return [...prev, cuisineName];
            }
            return [prev[1], cuisineName]; // Keep the last one and add the new one
        });
    };
    
    const canGenerate = selected.length === 2 && !isLoading;

    const handleSubmit = () => {
        if (canGenerate) {
            onGenerate(selected[0], selected[1]);
        }
    };

    return (
        <div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="fusion-modal-title"
        >
            <Card 
                isHoverable={false} 
                className="w-full max-w-2xl p-6 relative"
                onClick={(e) => e.stopPropagation()}
            >
                <button 
                    onClick={onClose} 
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-3xl leading-none"
                    aria-label="Close"
                >
                    &times;
                </button>
                <div className="text-center mb-4">
                    <h3 id="fusion-modal-title" className="text-2xl font-bold text-gray-700">Cuisine Fusion Challenge</h3>
                    <p className="text-gray-600 mt-1">Select two cuisines to create a unique fusion recipe!</p>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-64 overflow-y-auto p-2 border-y my-4">
                    {cuisines.map(cuisine => (
                        <div key={cuisine.id}>
                            <input 
                                type="checkbox"
                                id={`cuisine-${cuisine.id}`}
                                checked={selected.includes(cuisine.name)}
                                onChange={() => handleSelect(cuisine.name)}
                                className="hidden peer"
                            />
                            <label 
                                htmlFor={`cuisine-${cuisine.id}`}
                                className="block p-2 text-center rounded-lg border-2 border-gray-200 cursor-pointer transition-all duration-200 peer-checked:border-emerald-500 peer-checked:bg-emerald-50 peer-checked:font-semibold peer-checked:text-emerald-700 hover:bg-gray-100"
                            >
                                {cuisine.name}
                            </label>
                        </div>
                    ))}
                </div>

                <div className="flex justify-center mt-4">
                    <button 
                        onClick={handleSubmit} 
                        disabled={!canGenerate}
                        className="w-full max-w-xs bg-emerald-500 text-white font-bold py-3 px-4 rounded-full hover:bg-emerald-600 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center transform hover:scale-105"
                    >
                        {isLoading ? <Spinner /> : '✨ Generate Fusion Recipe'}
                    </button>
                </div>

            </Card>
        </div>
    );
};

export default FusionModal;


import { GoogleGenAI, Type } from "@google/genai";
import { Recipe, NutritionInfo } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY is not set. Please set it in your environment variables.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const recipeGenerationSchema = {
    type: Type.OBJECT,
    properties: {
        recipeName: { type: Type.STRING, description: "The name of the vegetarian recipe." },
        ingredients: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of ingredients with measurements."
        },
        instructions: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Step-by-step cooking instructions."
        },
        youtubeSearchQuery: { type: Type.STRING, description: "A concise search query for a YouTube video of the recipe." }
    },
    required: ["recipeName", "ingredients", "instructions", "youtubeSearchQuery"]
};


export const generateImageWithAI = async (promptSubject: string, type: 'cuisine' | 'dish'): Promise<string> => {
    try {
        const imagePrompt = type === 'dish'
            ? `A vibrant, appetizing, high-quality photograph of a vegetarian dish: "${promptSubject}". The food should look delicious and be presented beautifully on a plate. Clean, bright, professional food-photography style. Strictly vegetarian, no meat, fish, or eggs.`
            : `A beautiful, vibrant, high-quality image representing vegetarian ${promptSubject} cuisine, featuring a collage of popular, delicious dishes from the region. Professional food photography aesthetic. Strictly vegetarian, no meat, fish, or eggs.`;

        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: imagePrompt,
            config: {
              numberOfImages: 1,
              outputMimeType: 'image/jpeg',
              aspectRatio: '1:1',
            },
        });

        const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
        return `data:image/jpeg;base64,${base64ImageBytes}`;

    } catch (error) {
        console.error(`Error generating image for ${promptSubject}:`, error);
        const query = type === 'dish' ? `vegetarian%20${encodeURIComponent(promptSubject)}` : `vegetarian%20${encodeURIComponent(promptSubject)}%20food`;
        return `https://source.unsplash.com/500x500/?${query}`;
    }
}

export const getNutritionalInfo = async (ingredients: string[]): Promise<NutritionInfo | undefined> => {
    try {
        const prompt = `Analyze the following list of ingredients and provide an estimated nutritional analysis per serving. The ingredients are: ${ingredients.join(', ')}. Return only the JSON object with reasonable estimates.`;
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        calories: { type: Type.STRING, description: "Estimated calories per serving, e.g., '350-450 kcal'" },
                        protein: { type: Type.STRING, description: "Estimated protein per serving, e.g., '15g'" },
                        carbs: { type: Type.STRING, description: "Estimated carbohydrates per serving, e.g., '40g'" },
                        fat: { type: Type.STRING, description: "Estimated fat per serving, e.g., '18g'" }
                    },
                    required: ["calories", "protein", "carbs", "fat"]
                }
            }
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Error generating nutritional info:", error);
        return undefined;
    }
}


export const generateRecipeWithAI = async (
    cuisineName: string, 
    userIngredients: string, 
    image?: { inlineData: { data: string, mimeType: string } }
): Promise<Recipe> => {
    try {
        const textPrompt = `Generate a new, creative, and delicious VEGETARIAN (no meat, no fish, no eggs) recipe for the ${cuisineName} cuisine.
        ${image ? 'The recipe should be inspired by the vegetarian ingredients visible in the provided image. Identify them first. ' : ''}
        ${userIngredients ? `Also consider these user-provided ingredients: ${userIngredients}.` : ''}
        The recipe name must be unique and sound appetizing.
        Provide a list of ingredients with measurements, and step-by-step instructions.
        The instructions should be an array of strings, with each string being a single, clear step.
        Finally, provide a concise YouTube search query for a video of this recipe.
        Ensure the entire output is in JSON format, strictly following the provided schema.`;

        const contents = image ? { parts: [image, { text: textPrompt }] } : textPrompt;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: contents,
            config: {
                responseMimeType: "application/json",
                responseSchema: recipeGenerationSchema,
            },
        });
        
        const jsonText = response.text.trim();
        const parsedData = JSON.parse(jsonText);
        
        const [imageUrl, nutrition] = await Promise.all([
            generateImageWithAI(parsedData.recipeName, 'dish'),
            getNutritionalInfo(parsedData.ingredients)
        ]);

        const newRecipe: Recipe = {
            id: Date.now(),
            name: parsedData.recipeName,
            image: imageUrl,
            ingredients: parsedData.ingredients,
            instructions: parsedData.instructions,
            youtubeLink: `https://www.youtube.com/results?search_query=${encodeURIComponent(parsedData.youtubeSearchQuery)}`,
            nutrition: nutrition,
        };

        return newRecipe;

    } catch (error) {
        console.error("Error generating recipe with AI:", error);
        throw new Error("Failed to generate recipe. Please try again.");
    }
};


export const generateFusionRecipe = async (cuisine1Name: string, cuisine2Name: string): Promise<Recipe> => {
    try {
        const prompt = `Generate a new, creative, and delicious VEGETARIAN (no meat, no fish, no eggs) FUSION recipe that combines elements of ${cuisine1Name} and ${cuisine2Name} cuisine.
        The recipe name must be unique, sound appetizing, and reflect the fusion concept (e.g., 'Masala Mushroom Risotto' or 'Kimchi Caprese Salad').
        Provide a list of ingredients with measurements, and step-by-step instructions.
        The instructions should be an array of strings, with each string being a single, clear step.
        Finally, provide a concise YouTube search query for a video of this recipe.
        Ensure the entire output is in JSON format, strictly following the provided schema.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: recipeGenerationSchema,
            },
        });
        
        const jsonText = response.text.trim();
        const parsedData = JSON.parse(jsonText);
        
        const [imageUrl, nutrition] = await Promise.all([
            generateImageWithAI(parsedData.recipeName, 'dish'),
            getNutritionalInfo(parsedData.ingredients)
        ]);

        const newRecipe: Recipe = {
            id: Date.now(),
            name: parsedData.recipeName,
            image: imageUrl,
            ingredients: parsedData.ingredients,
            instructions: parsedData.instructions,
            youtubeLink: `https://www.youtube.com/results?search_query=${encodeURIComponent(parsedData.youtubeSearchQuery)}`,
            nutrition: nutrition,
        };

        return newRecipe;

    } catch (error) {
        console.error("Error generating fusion recipe with AI:", error);
        throw new Error("Failed to generate fusion recipe. Please try again.");
    }
};

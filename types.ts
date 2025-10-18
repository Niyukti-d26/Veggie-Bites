
export interface NutritionInfo {
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
}

export interface Recipe {
  id: number;
  name: string;
  image: string;
  ingredients: string[];
  instructions: string[];
  youtubeLink: string;
  nutrition?: NutritionInfo;
}

export interface Cuisine {
  id: number;
  name: string;
  description: string;
  image: string;
  recipes: Recipe[];
}

export enum View {
  LANDING,
  CUISINE_LIST,
  RECIPE_LIST,
  RECIPE_DETAIL,
  ADD_RECIPE,
  AUTH,
}

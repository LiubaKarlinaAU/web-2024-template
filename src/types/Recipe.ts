export interface Ingredient {
  name: string;
  amount: number;
  unit: string;
}

export interface Recipe {
  id: number;
  name: string;
  description: string;
  ingredients: Ingredient[];
  instructions: string[];
  originalServings: number;
  currentServings: number;
  prepTime: number; // in minutes
  cookTime: number; // in minutes
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  imageUrl?: string;
}

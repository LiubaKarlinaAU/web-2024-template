import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  MenuItem,
  Chip,
} from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import styled, { keyframes } from "styled-components";
import { Recipe, Ingredient } from "../types/Recipe";

const slideIn = keyframes`
  from {
    transform: translateY(-100px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const StyledDialog = styled(Dialog)`
  && {
    .MuiDialog-paper {
      border-radius: 20px;
      background: linear-gradient(145deg, #ffffff, #f8f9fa);
      animation: ${slideIn} 0.3s ease-out;
    }
  }
`;

const FormSection = styled(Box)`
  margin: 24px 0;
  padding: 20px;
  border-radius: 15px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
`;

const IngredientRow = styled(Box)`
  display: flex;
  gap: 12px;
  align-items: center;
  margin: 12px 0;
  padding: 12px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  backdrop-filter: blur(10px);
`;

const StyledTextField = styled(TextField)`
  && {
    .MuiOutlinedInput-root {
      border-radius: 10px;
      background: white;
    }
  }
`;

const StyledButton = styled(Button)`
  && {
    border-radius: 20px;
    font-weight: 600;
    text-transform: none;
    padding: 12px 24px;
  }
`;

interface RecipeFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (recipe: Recipe) => void;
  recipe?: Recipe;
}

export const RecipeForm = ({ open, onClose, onSave, recipe }: RecipeFormProps) => {
  const [formData, setFormData] = useState<Recipe>({
    id: Date.now(),
    name: "",
    description: "",
    ingredients: [{ name: "", amount: 0, unit: "" }],
    instructions: [""],
    originalServings: 4,
    currentServings: 4,
    prepTime: 15,
    cookTime: 30,
    difficulty: "Medium",
    category: "Main Course",
    imageUrl: "",
  });

  useEffect(() => {
    if (recipe) {
      setFormData(recipe);
    } else {
      setFormData({
        id: Date.now(),
        name: "",
        description: "",
        ingredients: [{ name: "", amount: 0, unit: "" }],
        instructions: [""],
        originalServings: 4,
        currentServings: 4,
        prepTime: 15,
        cookTime: 30,
        difficulty: "Medium",
        category: "Main Course",
        imageUrl: "",
      });
    }
  }, [recipe, open]);

  const handleInputChange = (field: keyof Recipe, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleIngredientChange = (index: number, field: keyof Ingredient, value: string | number) => {
    const newIngredients = [...formData.ingredients];
    newIngredients[index] = { ...newIngredients[index], [field]: value };
    setFormData(prev => ({ ...prev, ingredients: newIngredients }));
  };

  const addIngredient = () => {
    setFormData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, { name: "", amount: 0, unit: "" }]
    }));
  };

  const removeIngredient = (index: number) => {
    if (formData.ingredients.length > 1) {
      setFormData(prev => ({
        ...prev,
        ingredients: prev.ingredients.filter((_, i) => i !== index)
      }));
    }
  };

  const handleInstructionChange = (index: number, value: string) => {
    const newInstructions = [...formData.instructions];
    newInstructions[index] = value;
    setFormData(prev => ({ ...prev, instructions: newInstructions }));
  };

  const addInstruction = () => {
    setFormData(prev => ({
      ...prev,
      instructions: [...prev.instructions, ""]
    }));
  };

  const removeInstruction = (index: number) => {
    if (formData.instructions.length > 1) {
      setFormData(prev => ({
        ...prev,
        instructions: prev.instructions.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSave = () => {
    if (formData.name.trim() && formData.description.trim()) {
      onSave(formData);
      onClose();
    }
  };

  return (
    <StyledDialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h4" fontWeight="bold" color="primary">
          {recipe ? "Edit Recipe" : "Add New Recipe"}
        </Typography>
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
          <StyledTextField
            fullWidth
            label="Recipe Name"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            variant="outlined"
          />
          <StyledTextField
            fullWidth
            label="Category"
            value={formData.category}
            onChange={(e) => handleInputChange("category", e.target.value)}
            variant="outlined"
          />
        </Box>

        <StyledTextField
          fullWidth
          label="Description"
          value={formData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          variant="outlined"
          multiline
          rows={3}
          sx={{ mb: 3 }}
        />

        <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
          <StyledTextField
            label="Prep Time (min)"
            type="number"
            value={formData.prepTime}
            onChange={(e) => handleInputChange("prepTime", parseInt(e.target.value) || 0)}
            variant="outlined"
          />
          <StyledTextField
            label="Cook Time (min)"
            type="number"
            value={formData.cookTime}
            onChange={(e) => handleInputChange("cookTime", parseInt(e.target.value) || 0)}
            variant="outlined"
          />
          <StyledTextField
            select
            label="Difficulty"
            value={formData.difficulty}
            onChange={(e) => handleInputChange("difficulty", e.target.value)}
            variant="outlined"
            sx={{ minWidth: 120 }}
          >
            <MenuItem value="Easy">Easy</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="Hard">Hard</MenuItem>
          </StyledTextField>
          <StyledTextField
            label="Original Servings"
            type="number"
            value={formData.originalServings}
            onChange={(e) => handleInputChange("originalServings", parseInt(e.target.value) || 1)}
            variant="outlined"
          />
        </Box>

        <StyledTextField
          fullWidth
          label="Image URL (optional)"
          value={formData.imageUrl}
          onChange={(e) => handleInputChange("imageUrl", e.target.value)}
          variant="outlined"
          sx={{ mb: 3 }}
        />

        <FormSection>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            🥘 Ingredients
          </Typography>
          {formData.ingredients.map((ingredient, index) => (
            <IngredientRow key={index}>
              <StyledTextField
                label="Amount"
                type="number"
                value={ingredient.amount}
                onChange={(e) => handleIngredientChange(index, "amount", parseFloat(e.target.value) || 0)}
                size="small"
                sx={{ width: 100 }}
              />
              <StyledTextField
                label="Unit"
                value={ingredient.unit}
                onChange={(e) => handleIngredientChange(index, "unit", e.target.value)}
                size="small"
                sx={{ width: 100 }}
              />
              <StyledTextField
                label="Ingredient Name"
                value={ingredient.name}
                onChange={(e) => handleIngredientChange(index, "name", e.target.value)}
                size="small"
                sx={{ flexGrow: 1 }}
              />
              <IconButton onClick={() => removeIngredient(index)} color="error">
                <Remove />
              </IconButton>
            </IngredientRow>
          ))}
          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={addIngredient}
            sx={{ color: 'white', borderColor: 'white', mt: 1 }}
          >
            Add Ingredient
          </Button>
        </FormSection>

        <FormSection>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            👨‍🍳 Instructions
          </Typography>
          {formData.instructions.map((instruction, index) => (
            <Box key={index} sx={{ display: "flex", gap: 2, mb: 2 }}>
              <Chip label={index + 1} sx={{ alignSelf: 'flex-start' }} />
              <StyledTextField
                fullWidth
                label={`Step ${index + 1}`}
                value={instruction}
                onChange={(e) => handleInstructionChange(index, e.target.value)}
                variant="outlined"
                multiline
                rows={2}
              />
              <IconButton onClick={() => removeInstruction(index)} color="error">
                <Remove />
              </IconButton>
            </Box>
          ))}
          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={addInstruction}
            sx={{ color: 'white', borderColor: 'white', mt: 1 }}
          >
            Add Step
          </Button>
        </FormSection>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <StyledButton onClick={onClose} variant="outlined">
          Cancel
        </StyledButton>
        <StyledButton
          onClick={handleSave}
          variant="contained"
          sx={{
            background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
          }}
        >
          {recipe ? "Update Recipe" : "Save Recipe"}
        </StyledButton>
      </DialogActions>
    </StyledDialog>
  );
};

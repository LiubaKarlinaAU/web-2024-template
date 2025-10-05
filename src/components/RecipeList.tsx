import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Chip,
  Grid,
} from "@mui/material";
import { Search, Add, Restaurant } from "@mui/icons-material";
import styled, { keyframes } from "styled-components";
import { Recipe } from "../types/Recipe";
import { RecipeCard } from "./RecipeCard";

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const StyledBox = styled(Box)`
  animation: ${fadeIn} 0.5s ease-out;
`;

const HeaderSection = styled(Box)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 20px;
  border-radius: 0 0 30px 30px;
  color: white;
  margin-bottom: 30px;
`;

const SearchBox = styled(Box)`
  display: flex;
  gap: 16px;
  margin: 24px 0;
  align-items: center;
`;

const StyledTextField = styled(TextField)`
  && {
    .MuiOutlinedInput-root {
      border-radius: 25px;
      background: white;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }
  }
`;

const StyledButton = styled(Button)`
  && {
    border-radius: 25px;
    padding: 12px 30px;
    font-weight: 600;
    text-transform: none;
    background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
    }
  }
`;

const CategoryChip = styled(Chip)`
  && {
    border-radius: 20px;
    font-weight: 600;
    margin: 4px;
    transition: all 0.3s ease;
    
    &:hover {
      transform: scale(1.1);
    }
  }
`;

const StatsBox = styled(Box)`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 20px;
  backdrop-filter: blur(10px);
  margin: 20px 0;
`;

interface RecipeListProps {
  recipes: Recipe[];
  onAddRecipe: () => void;
  onEditRecipe: (recipe: Recipe) => void;
  onDeleteRecipe: (id: number) => void;
  onUpdateServings: (id: number, servings: number) => void;
}

export const RecipeList = ({
  recipes,
  onAddRecipe,
  onEditRecipe,
  onDeleteRecipe,
  onUpdateServings,
}: RecipeListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", ...Array.from(new Set(recipes.map(r => r.category)))];

  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         recipe.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         recipe.ingredients.some(ing => ing.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "All" || recipe.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalPrepTime = recipes.reduce((sum, recipe) => sum + recipe.prepTime + recipe.cookTime, 0);
  const avgDifficulty = recipes.length > 0 ? 
    recipes.reduce((sum, recipe) => sum + (recipe.difficulty === 'Easy' ? 1 : recipe.difficulty === 'Medium' ? 2 : 3), 0) / recipes.length : 0;

  return (
    <StyledBox>
      <HeaderSection>
        <Typography variant="h3" component="h1" fontWeight="bold" textAlign="center">
          🍳 Recipe Collection
        </Typography>
        <Typography variant="h6" textAlign="center" sx={{ mt: 2, opacity: 0.9 }}>
          Discover, create, and manage your favorite recipes
        </Typography>

        <SearchBox>
          <StyledTextField
            fullWidth
            placeholder="Search recipes, ingredients, or descriptions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search color="action" />
                </InputAdornment>
              ),
            }}
          />
          <StyledButton
            variant="contained"
            startIcon={<Add />}
            onClick={onAddRecipe}
          >
            Add Recipe
          </StyledButton>
        </SearchBox>

        <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
          {categories.map(category => (
            <CategoryChip
              key={category}
              label={category}
              variant={selectedCategory === category ? "filled" : "outlined"}
              onClick={() => setSelectedCategory(category)}
              sx={{
                backgroundColor: selectedCategory === category ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                color: 'white',
                borderColor: 'white',
              }}
            />
          ))}
        </Box>

        <StatsBox>
          <Typography variant="h6" fontWeight="bold" textAlign="center">
            📊 Collection Stats
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 2 }}>
            <Box textAlign="center">
              <Typography variant="h4" fontWeight="bold">
                {recipes.length}
              </Typography>
              <Typography variant="body2">Total Recipes</Typography>
            </Box>
            <Box textAlign="center">
              <Typography variant="h4" fontWeight="bold">
                {Math.round(totalPrepTime / recipes.length) || 0}m
              </Typography>
              <Typography variant="body2">Avg Cook Time</Typography>
            </Box>
            <Box textAlign="center">
              <Typography variant="h4" fontWeight="bold">
                {avgDifficulty.toFixed(1)}
              </Typography>
              <Typography variant="body2">Avg Difficulty</Typography>
            </Box>
          </Box>
        </StatsBox>
      </HeaderSection>

      <Box sx={{ px: 2 }}>
        {filteredRecipes.length === 0 ? (
          <Box textAlign="center" sx={{ py: 8 }}>
            <Restaurant sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h5" color="text.secondary" gutterBottom>
              {searchTerm || selectedCategory !== "All" 
                ? "No recipes found matching your criteria" 
                : "No recipes yet"}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {searchTerm || selectedCategory !== "All"
                ? "Try adjusting your search or filter"
                : "Start building your recipe collection!"}
            </Typography>
            {!searchTerm && selectedCategory === "All" && (
              <StyledButton
                variant="contained"
                startIcon={<Add />}
                onClick={onAddRecipe}
              >
                Add Your First Recipe
              </StyledButton>
            )}
          </Box>
        ) : (
          <Grid container spacing={2}>
            {filteredRecipes.map((recipe) => (
              <Grid item xs={12} sm={6} lg={4} key={recipe.id}>
                <RecipeCard
                  recipe={recipe}
                  onEdit={onEditRecipe}
                  onDelete={onDeleteRecipe}
                  onUpdateServings={onUpdateServings}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </StyledBox>
  );
};

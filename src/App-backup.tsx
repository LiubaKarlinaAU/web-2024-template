import { useState, useEffect } from "react";
import useLocalStorageState from "use-local-storage-state";
import styled from "styled-components";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Recipe } from "./types/Recipe";
import { RecipeList } from "./components/RecipeList";
import { RecipeForm } from "./components/RecipeForm";
import { boilerplateRecipes } from "./data/boilerplateRecipes";

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow-x: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.2) 0%, transparent 50%);
    pointer-events: none;
  }
`;

const theme = createTheme({
  palette: {
    primary: {
      main: '#667eea',
    },
    secondary: {
      main: '#764ba2',
    },
    background: {
      default: 'transparent',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 800,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
});

function App() {
  const [recipes, setRecipes] = useLocalStorageState<Recipe[]>("recipes", {
    defaultValue: [],
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | undefined>();

  useEffect(() => {
    if (recipes.length === 0) {
      setRecipes(boilerplateRecipes);
    }
  }, [recipes, setRecipes]);

  const handleAddRecipe = () => {
    setEditingRecipe(undefined);
    setIsFormOpen(true);
  };

  const handleEditRecipe = (recipe: Recipe) => {
    setEditingRecipe(recipe);
    setIsFormOpen(true);
  };

  const handleSaveRecipe = (recipe: Recipe) => {
    if (editingRecipe) {
      setRecipes(recipes.map(r => r.id === recipe.id ? recipe : r));
    } else {
      setRecipes([...recipes, { ...recipe, id: Date.now() }]);
    }
  };

  const handleDeleteRecipe = (id: number) => {
    setRecipes(recipes.filter(r => r.id !== id));
  };

  const handleUpdateServings = (id: number, servings: number) => {
    setRecipes(recipes.map(r => 
      r.id === id ? { ...r, currentServings: servings } : r
    ));
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingRecipe(undefined);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppContainer>
        <RecipeList
          recipes={recipes}
          onAddRecipe={handleAddRecipe}
          onEditRecipe={handleEditRecipe}
          onDeleteRecipe={handleDeleteRecipe}
          onUpdateServings={handleUpdateServings}
        />
        <RecipeForm
          open={isFormOpen}
          onClose={handleCloseForm}
          onSave={handleSaveRecipe}
          recipe={editingRecipe}
        />
      </AppContainer>
    </ThemeProvider>
  );
}

export default App;

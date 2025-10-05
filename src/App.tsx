import { useState, useEffect } from "react";
import useLocalStorageState from "use-local-storage-state";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import {
  Typography,
  Box, 
  Button, 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Chip,
  List,
  ListItem,
  ListItemText,
  Collapse,
} from "@mui/material";
import { Add, ExpandMore, ExpandLess, Delete } from "@mui/icons-material";
import { Recipe, Ingredient } from "./types/Recipe";
import { boilerplateRecipes } from "./data/boilerplateRecipes";

const theme = createTheme({
  palette: {
    primary: {
      main: '#667eea',
    },
    secondary: {
      main: '#764ba2',
    },
  },
});

function App() {
  const [recipes, setRecipes] = useLocalStorageState<Recipe[]>("recipes", {
    defaultValue: [],
  });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [expandedRecipe, setExpandedRecipe] = useState<number | null>(null);
  const [newRecipe, setNewRecipe] = useState<Partial<Recipe>>({
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
  });

  useEffect(() => {
    if (recipes.length === 0) {
      setRecipes(boilerplateRecipes);
    }
  }, [recipes, setRecipes]);

  const handleAddRecipe = () => {
    if (newRecipe.name && newRecipe.description) {
      const recipe: Recipe = {
        id: Date.now(),
        name: newRecipe.name,
        description: newRecipe.description,
        ingredients: newRecipe.ingredients || [],
        instructions: newRecipe.instructions || [],
        originalServings: newRecipe.originalServings || 4,
        currentServings: newRecipe.currentServings || 4,
        prepTime: newRecipe.prepTime || 15,
        cookTime: newRecipe.cookTime || 30,
        difficulty: newRecipe.difficulty as "Easy" | "Medium" | "Hard",
        category: newRecipe.category || "Main Course",
      };
      setRecipes([...recipes, recipe]);
      setIsAddDialogOpen(false);
      setNewRecipe({
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
      });
    }
  };

  const addIngredient = () => {
    setNewRecipe(prev => ({
      ...prev,
      ingredients: [...(prev.ingredients || []), { name: "", amount: 0, unit: "" }]
    }));
  };

  const removeIngredient = (index: number) => {
    setNewRecipe(prev => ({
      ...prev,
      ingredients: prev.ingredients?.filter((_, i) => i !== index) || []
    }));
  };

  const updateIngredient = (index: number, field: keyof Ingredient, value: string | number) => {
    setNewRecipe(prev => ({
      ...prev,
      ingredients: prev.ingredients?.map((ing, i) => 
        i === index ? { ...ing, [field]: value } : ing
      ) || []
    }));
  };

  const addInstruction = () => {
    setNewRecipe(prev => ({
      ...prev,
      instructions: [...(prev.instructions || []), ""]
    }));
  };

  const removeInstruction = (index: number) => {
    setNewRecipe(prev => ({
      ...prev,
      instructions: prev.instructions?.filter((_, i) => i !== index) || []
    }));
  };

  const updateInstruction = (index: number, value: string) => {
    setNewRecipe(prev => ({
      ...prev,
      instructions: prev.instructions?.map((inst, i) => 
        i === index ? value : inst
      ) || []
    }));
  };

  const deleteRecipe = (id: number) => {
    setRecipes(recipes.filter(r => r.id !== id));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 4,
        }}
      >
        <Typography
          variant="h2"
          component="h1"
          sx={{
            color: 'white',
            fontWeight: 'bold',
            textAlign: 'center',
            mb: 4,
          }}
        >
          🍳 Recipe Collection App
        </Typography>
        
        <Typography variant="h6" sx={{ color: 'white', mb: 4, opacity: 0.9 }}>
          ✅ Recipe Collection - {recipes.length} recipes loaded
        </Typography>

        {/* Add Recipe Button */}
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setIsAddDialogOpen(true)}
          sx={{
            background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
            borderRadius: 3,
            px: 4,
            py: 2,
            fontSize: '1.1rem',
            fontWeight: 'bold',
            mb: 4,
          }}
        >
          Add New Recipe
        </Button>

        {/* Recipe List */}
        <Box sx={{ mb: 4, maxWidth: 800 }}>
          {recipes.map((recipe) => (
            <Box
              key={recipe.id}
              sx={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: 2,
                padding: 2,
                margin: 1,
                color: 'white',
                backdropFilter: 'blur(10px)',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {recipe.name}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>
                    {recipe.description}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip label={`🍽️ ${recipe.currentServings} servings`} size="small" sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }} />
                    <Chip label={`⏱️ ${recipe.prepTime + recipe.cookTime} min`} size="small" sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }} />
                    <Chip label={`📊 ${recipe.difficulty}`} size="small" sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }} />
                    <Chip label={recipe.category} size="small" sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }} />
                  </Box>
                </Box>
                <Box>
                  <IconButton
                    onClick={() => setExpandedRecipe(expandedRecipe === recipe.id ? null : recipe.id)}
                    sx={{ color: 'white' }}
                  >
                    {expandedRecipe === recipe.id ? <ExpandLess /> : <ExpandMore />}
                  </IconButton>
                  <IconButton
                    onClick={() => deleteRecipe(recipe.id)}
                    sx={{ color: '#ff6b6b' }}
                  >
                    <Delete />
                  </IconButton>
                </Box>
              </Box>

              {/* Expandable Recipe Details */}
              <Collapse in={expandedRecipe === recipe.id}>
                <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(255,255,255,0.2)' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                    🥘 Ingredients:
                  </Typography>
                  <List dense>
                    {recipe.ingredients.map((ingredient, index) => (
                      <ListItem key={index} sx={{ py: 0 }}>
                        <ListItemText 
                          primary={`${ingredient.amount} ${ingredient.unit} ${ingredient.name}`}
                          sx={{ color: 'white' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                  
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, mt: 2 }}>
                    👨‍🍳 Instructions:
                  </Typography>
                  <List dense>
                    {recipe.instructions.map((instruction, index) => (
                      <ListItem key={index} sx={{ py: 0 }}>
                        <ListItemText 
                          primary={`${index + 1}. ${instruction}`}
                          sx={{ color: 'white' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </Collapse>
            </Box>
          ))}
        </Box>

        {/* Add Recipe Dialog */}
        <Dialog 
          open={isAddDialogOpen} 
          onClose={() => setIsAddDialogOpen(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              background: 'linear-gradient(145deg, #ffffff, #f8f9fa)',
            }
          }}
        >
          <DialogTitle>
            <Typography variant="h4" fontWeight="bold" color="primary">
              ➕ Add New Recipe
      </Typography>
          </DialogTitle>
          
          <DialogContent>
            {/* Basic Info */}
            <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
      <TextField
        fullWidth
                label="Recipe Name"
                value={newRecipe.name}
                onChange={(e) => setNewRecipe({...newRecipe, name: e.target.value})}
        variant="outlined"
              />
              <TextField
                fullWidth
                label="Category"
                value={newRecipe.category}
                onChange={(e) => setNewRecipe({...newRecipe, category: e.target.value})}
                variant="outlined"
              />
            </Box>

            <TextField
              fullWidth
              label="Description"
              value={newRecipe.description}
              onChange={(e) => setNewRecipe({...newRecipe, description: e.target.value})}
              variant="outlined"
              multiline
              rows={3}
              sx={{ mb: 3 }}
            />

            <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
              <TextField
                label="Prep Time (min)"
                type="number"
                value={newRecipe.prepTime}
                onChange={(e) => setNewRecipe({...newRecipe, prepTime: parseInt(e.target.value) || 0})}
                variant="outlined"
                size="small"
              />
              <TextField
                label="Cook Time (min)"
                type="number"
                value={newRecipe.cookTime}
                onChange={(e) => setNewRecipe({...newRecipe, cookTime: parseInt(e.target.value) || 0})}
                variant="outlined"
                size="small"
              />
              <TextField
                label="Servings"
                type="number"
                value={newRecipe.originalServings}
                onChange={(e) => setNewRecipe({...newRecipe, originalServings: parseInt(e.target.value) || 1, currentServings: parseInt(e.target.value) || 1})}
                variant="outlined"
                size="small"
              />
              <TextField
                select
                label="Difficulty"
                value={newRecipe.difficulty}
                onChange={(e) => setNewRecipe({...newRecipe, difficulty: e.target.value as "Easy" | "Medium" | "Hard"})}
                variant="outlined"
                size="small"
                sx={{ minWidth: 120 }}
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </TextField>
            </Box>

            {/* Ingredients */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                🥘 Ingredients
              </Typography>
              {newRecipe.ingredients?.map((ingredient, index) => (
                <Box key={index} sx={{ display: "flex", gap: 1, mb: 2, alignItems: "center" }}>
                  <TextField
                    label="Amount"
                    type="number"
                    value={ingredient.amount}
                    onChange={(e) => updateIngredient(index, "amount", parseFloat(e.target.value) || 0)}
                    size="small"
                    sx={{ width: 100 }}
                  />
                  <TextField
                    label="Unit"
                    value={ingredient.unit}
                    onChange={(e) => updateIngredient(index, "unit", e.target.value)}
                    size="small"
                    sx={{ width: 100 }}
                  />
                  <TextField
                    label="Ingredient Name"
                    value={ingredient.name}
                    onChange={(e) => updateIngredient(index, "name", e.target.value)}
                    size="small"
                    sx={{ flexGrow: 1 }}
                  />
                  <IconButton onClick={() => removeIngredient(index)} color="error" size="small">
                    <Delete />
              </IconButton>
                </Box>
              ))}
              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={addIngredient}
                size="small"
              >
                Add Ingredient
              </Button>
            </Box>

            {/* Instructions */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                👨‍🍳 Instructions
              </Typography>
              {newRecipe.instructions?.map((instruction, index) => (
                <Box key={index} sx={{ display: "flex", gap: 1, mb: 2, alignItems: "flex-start" }}>
                  <Chip label={index + 1} sx={{ alignSelf: 'flex-start', mt: 1 }} />
                  <TextField
                    fullWidth
                    label={`Step ${index + 1}`}
                    value={instruction}
                    onChange={(e) => updateInstruction(index, e.target.value)}
                    variant="outlined"
                    multiline
                    rows={2}
                    size="small"
                  />
                  <IconButton onClick={() => removeInstruction(index)} color="error" size="small" sx={{ mt: 1 }}>
                    <Delete />
              </IconButton>
                </Box>
              ))}
              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={addInstruction}
                size="small"
              >
                Add Step
              </Button>
            </Box>
          </DialogContent>

          <DialogActions sx={{ p: 3 }}>
            <Button 
              onClick={() => setIsAddDialogOpen(false)}
              variant="outlined"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddRecipe}
              variant="contained"
              sx={{
                background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
              }}
            >
              Save Recipe
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
}

export default App;

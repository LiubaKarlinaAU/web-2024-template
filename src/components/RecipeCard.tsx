import { useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Chip,
  IconButton,
  TextField,
  Box,
  Collapse,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import {
  ExpandMore,
  ExpandLess,
  Edit,
  Delete,
  AccessTime,
  Restaurant,
} from "@mui/icons-material";
import styled, { keyframes } from "styled-components";
import { Recipe } from "../types/Recipe";

const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

const StyledCard = styled(Card)`
  && {
    margin: 16px;
    border-radius: 20px;
    background: linear-gradient(145deg, #ffffff, #f0f0f0);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    animation: ${pulse} 2s infinite;
    
    &:hover {
      transform: translateY(-8px) rotateX(5deg);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
      animation: ${bounce} 0.6s ease-in-out;
    }
  }
`;

const StyledCardMedia = styled(CardMedia)`
  && {
    height: 200px;
    background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #f9ca24);
    background-size: 400% 400%;
    animation: gradientShift 4s ease infinite;
    
    @keyframes gradientShift {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
  }
`;

const HeaderBox = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const ChipContainer = styled(Box)`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin: 12px 0;
`;

const StyledChip = styled(Chip)<{ variant: 'filled' | 'outlined' }>`
  && {
    border-radius: 20px;
    font-weight: 600;
    ${(props) => props.variant === 'filled' && `
      background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
      color: white;
      animation: ${pulse} 2s infinite;
    `}
  }
`;

const PortionBox = styled(Box)`
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 16px 0;
  padding: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 15px;
  color: white;
`;

const StyledTextField = styled(TextField)`
  && {
    .MuiOutlinedInput-root {
      border-radius: 10px;
      background: white;
      color: #333;
    }
  }
`;

const IngredientList = styled(List)`
  && {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    border-radius: 15px;
    padding: 16px;
    margin: 16px 0;
  }
`;

const InstructionList = styled(List)`
  && {
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    border-radius: 15px;
    padding: 16px;
    margin: 16px 0;
  }
`;

interface RecipeCardProps {
  recipe: Recipe;
  onEdit: (recipe: Recipe) => void;
  onDelete: (id: number) => void;
  onUpdateServings: (id: number, servings: number) => void;
}

export const RecipeCard = ({ recipe, onEdit, onDelete, onUpdateServings }: RecipeCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const [servings, setServings] = useState(recipe.currentServings);

  const handleServingsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newServings = parseInt(event.target.value) || 1;
    setServings(newServings);
    onUpdateServings(recipe.id, newServings);
  };

  const getMultiplier = () => servings / recipe.originalServings;

  return (
    <StyledCard>
      <StyledCardMedia
        image={recipe.imageUrl || undefined}
        title={recipe.name}
      />
      <CardContent>
        <HeaderBox>
          <Typography variant="h5" component="h2" fontWeight="bold" color="primary">
            {recipe.name}
          </Typography>
          <Box>
            <IconButton onClick={() => onEdit(recipe)} color="primary">
              <Edit />
            </IconButton>
            <IconButton onClick={() => onDelete(recipe.id)} color="error">
              <Delete />
            </IconButton>
          </Box>
        </HeaderBox>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {recipe.description}
        </Typography>

        <ChipContainer>
          <StyledChip
            icon={<AccessTime />}
            label={`${recipe.prepTime + recipe.cookTime} min`}
            variant="filled"
          />
          <StyledChip
            icon={<Restaurant />}
            label={recipe.difficulty}
            variant="outlined"
          />
          <StyledChip label={recipe.category} variant="outlined" />
        </ChipContainer>

        <PortionBox>
          <Typography variant="subtitle1" fontWeight="bold">
            Servings:
          </Typography>
          <StyledTextField
            type="number"
            value={servings}
            onChange={handleServingsChange}
            inputProps={{ min: 1, max: 20 }}
            size="small"
            sx={{ width: 80 }}
          />
          <Typography variant="body2">
            (Original: {recipe.originalServings})
          </Typography>
        </PortionBox>

        <Button
          variant="contained"
          onClick={() => setExpanded(!expanded)}
          endIcon={expanded ? <ExpandLess /> : <ExpandMore />}
          sx={{
            background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
            borderRadius: 20,
            mb: 2,
          }}
        >
          {expanded ? 'Show Less' : 'View Recipe'}
        </Button>

        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <IngredientList>
            <Typography variant="h6" color="white" fontWeight="bold" sx={{ mb: 2 }}>
              🥘 Ingredients
            </Typography>
            {recipe.ingredients.map((ingredient, index) => {
              const adjustedAmount = (ingredient.amount * getMultiplier()).toFixed(1);
              return (
                <ListItem key={index} sx={{ color: 'white' }}>
                  <ListItemText
                    primary={`${adjustedAmount} ${ingredient.unit} ${ingredient.name}`}
                  />
                </ListItem>
              );
            })}
          </IngredientList>

          <InstructionList>
            <Typography variant="h6" color="white" fontWeight="bold" sx={{ mb: 2 }}>
              👨‍🍳 Instructions
            </Typography>
            {recipe.instructions.map((instruction, index) => (
              <ListItem key={index} sx={{ color: 'white' }}>
                <ListItemText
                  primary={`${index + 1}. ${instruction}`}
                />
              </ListItem>
            ))}
          </InstructionList>
        </Collapse>
      </CardContent>
    </StyledCard>
  );
};

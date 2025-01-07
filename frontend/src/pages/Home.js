import React, { useState, useEffect } from 'react';
import RecipeList from '../components/RecipeList';
import AddRecipe from '../components/AddRecipe';
import RecipeAI from '../components/RecipeAI';

const Home = () => {
  const [recipes, setRecipes] = useState([]);

  const loadRecipes = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/recipes');
      const data = await response.json();
      setRecipes(data);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  };

  const handleRecipeAdded = async (newRecipe) => {
    console.log('Adding new recipe:', newRecipe); // Debug: Log the new recipe
    try {
      const response = await fetch('http://localhost:5000/api/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRecipe),
      });
      const data = await response.json();
      console.log('Recipe added successfully:', data);
      setRecipes((prevRecipes) => [...prevRecipes, data]); // Update the recipe list
    } catch (error) {
      console.error('Error adding recipe:', error);
    }
  };
  

  useEffect(() => {
    loadRecipes();
  }, []);

  return (
    <div className="container mt-4">
      <AddRecipe onRecipeAdded={handleRecipeAdded} />
      <RecipeList recipes={recipes} onRefresh={loadRecipes} />
      <RecipeAI onRecipeAdded={handleRecipeAdded} /> {/* Add AI component */}
    </div>
  );
};

export default Home;

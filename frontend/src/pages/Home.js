import React, { useState, useEffect } from 'react';
import RecipeList from '../components/RecipeList';
import AddRecipe from '../components/AddRecipe';
import RecipeAI from '../components/RecipeAI';

const Home = () => {
  const [recipes, setRecipes] = useState([]);

  const loadRecipes = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      const response = await fetch('http://localhost:5000/api/recipes', {
        headers: { 
          'Authorization': `Bearer ${token}`
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setRecipes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching recipes:', error);
      setRecipes([]); // Ensure state remains an array
    }
  };

  const handleRecipeAdded = async (newRecipe) => {
    try {
      const token = localStorage.getItem('token');
  
      if (!token) {
        console.error('No token found. User is not authenticated.');
        return;
      }
  
      const response = await fetch('http://localhost:5000/api/recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newRecipe),
      });
  
      if (!response.ok) {
        const errorMessage = await response.json();
        throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorMessage.message}`);
      }
  
      const data = await response.json();
      console.log('AI Recipe added successfully:', data);
      setRecipes((prevRecipes) => [...prevRecipes, data]);
    } catch (error) {
      console.error('Error adding AI-generated recipe:', error);
    }
  };
  

  useEffect(() => {
    loadRecipes();
  }, []);

  return (
    <div className="container mt-4">
      <AddRecipe onRecipeAdded={handleRecipeAdded} />
      <RecipeList recipes={recipes} onRefresh={loadRecipes} />
      <RecipeAI onRecipeAdded={handleRecipeAdded} />
    </div>
  );
};

export default Home;

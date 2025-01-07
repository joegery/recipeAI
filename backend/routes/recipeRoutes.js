const express = require('express');
const Recipe = require('../models/Recipe');
const router = express.Router();
const mongoose = require('mongoose');
const axios = require('axios'); 


// Get all recipes
router.get('/', async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.status(200).json(recipes);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// Create a new recipe
router.post('/', async (req, res) => {
    try {
      console.log('Received recipe data:', req.body); // Log incoming data
      const { title, ingredients, instructions, image } = req.body;
  
      if (!title || !ingredients || !instructions) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
  
      const newRecipe = new Recipe({
        title,
        ingredients,
        instructions,
        image: image || 'https://via.placeholder.com/400', // Default image if none provided
      });
  
      const savedRecipe = await newRecipe.save();
      res.status(201).json(savedRecipe);
    } catch (error) {
      console.error('Error saving recipe:', error.message);
      res.status(500).json({ message: 'Failed to add recipe' });
    }
  });
  
  
  

// Update a recipe
router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const updatedRecipe = req.body;

  try {
    const result = await Recipe.findByIdAndUpdate(id, updatedRecipe, { new: true });
    res.status(200).json(result);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// Delete a recipe

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
  
    console.log('DELETE request received for ID:', id);
  
    // Validate the ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.error('Invalid MongoDB ObjectId:', id);
      return res.status(404).json({ message: 'Invalid recipe ID.' });
    }
  
    try {
      const deletedRecipe = await Recipe.findByIdAndDelete(id);
  
      if (!deletedRecipe) {
        console.error('Recipe not found:', id);
        return res.status(404).json({ message: 'Recipe not found.' });
      }
  
      console.log('Recipe deleted successfully:', deletedRecipe);
      res.status(200).json({ message: 'Recipe deleted successfully.' });
    } catch (error) {
      console.error('Error during deletion:', error.message);
      res.status(500).json({ message: 'Internal server error during deletion.' });
    }
  });

  
  const extractSection = (content, sectionTitle) => {
    const regex = new RegExp(`### ${sectionTitle}([\\s\\S]*?)(?=###|$)`, 'i');
    const match = content.match(regex);
    return match ? match[1].trim() : null;
  };
  
  router.post('/generate-recipe', async (req, res) => {
    const { prompt } = req.body;
  
    try {
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) {
        console.error('OpenAI API key is missing.');
        return res.status(500).json({ error: 'OpenAI API key is not configured.' });
      }
  
      // Request recipe content
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'user',
              content: `Generate a recipe for: ${prompt}. Follow this exact format strictly:
  
              Title: [Recipe Title]
  
              Ingredients:
              - [Ingredient 1]
              - [Ingredient 2]
              - [Ingredient 3]
              ... (as many as necessary)
  
              Instructions:
              1. [Step 1]
              2. [Step 2]
              3. [Step 3]
              ... (as many as necessary)`,
            },
          ],
          temperature: 0.7,
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );
  
      let generatedContent = response.data.choices[0].message.content;
      console.log('Generated recipe content:', generatedContent);
  
      // Normalize and parse content
      generatedContent = generatedContent.trim().replace(/^\s+/gm, '');
      console.log('Normalized recipe content:', generatedContent);
  
      const titleMatch = generatedContent.match(/Title:\s*(.+)/);
      const title = titleMatch ? titleMatch[1].trim() : 'Untitled Recipe';
  
      const ingredientsMatch = generatedContent.match(/Ingredients:\s*([\s\S]*?)Instructions:/);
      const ingredients = ingredientsMatch
        ? ingredientsMatch[1]
            .trim()
            .split('\n')
            .map((line) => line.replace(/^-/, '').trim())
        : [];
  
      const instructionsMatch = generatedContent.match(/Instructions:\s*([\s\S]*)/);
      const instructions = instructionsMatch
        ? instructionsMatch[1]
            .trim()
            .split('\n')
            .map((line) => line.trim())
        : [];
  
      if (!title || ingredients.length === 0 || instructions.length === 0) {
        throw new Error('Failed to extract ingredients or instructions from the generated content.');
      }
  
      console.log('Parsed Recipe:', { title, ingredients, instructions });
  
      // Generate an image
      let imageUrl = 'https://via.placeholder.com/400'; // Default placeholder
      try {
        const imageResponse = await axios.post(
          'https://api.openai.com/v1/images/generations',
          {
            prompt: `A delicious dish of ${title}, beautifully plated, high quality, professional food photography.`,
            n: 1,
            size: '1024x1024',
          },
          {
            headers: {
              Authorization: `Bearer ${apiKey}`,
            },
          }
        );
        imageUrl = imageResponse.data.data[0].url;
        console.log('Generated Image URL:', imageUrl);
      } catch (imageError) {
        console.error('Error generating image:', imageError.message);
        console.log('Falling back to placeholder image.');
      }
  
      // Save the recipe to the database
      const newRecipe = {
        title,
        ingredients,
        instructions: instructions.join('\n'),
        image: imageUrl,
      };
  
      console.log('Recipe to save:', newRecipe);
      const savedRecipe = await Recipe.create(newRecipe);
      res.status(200).json(savedRecipe);
    } catch (error) {
      console.error('Error generating recipe:', error.message, error.response?.data || '');
      res.status(500).json({ error: 'Failed to generate recipe.', details: error.message });
    }
  });
  
  

     
  

module.exports = router;

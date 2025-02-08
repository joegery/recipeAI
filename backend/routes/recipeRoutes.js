const express = require('express');
const Recipe = require('../models/Recipe');
const authMiddleware = require('../middleware/authMiddleware'); 
const router = express.Router();
const mongoose = require('mongoose');
const axios = require('axios'); 

router.get('/', authMiddleware, async (req, res) => {
  try {
    const recipes = await Recipe.find({ user: req.user.id }); 
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching recipes' });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    console.log('Received recipe data:', req.body);
    const { title, ingredients, instructions, image } = req.body;

    if (!title || !ingredients || !instructions) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newRecipe = new Recipe({
      title,
      ingredients,
      instructions,
      image: image || 'https://via.placeholder.com/400', 
      user: req.user.id, 
    });

    const savedRecipe = await newRecipe.save();
    res.status(201).json(savedRecipe);
  } catch (error) {
    console.error('Error saving recipe:', error.message);
    res.status(500).json({ message: 'Failed to add recipe' });
  }
});

router.patch('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const updatedRecipe = req.body;

  try {
    const recipe = await Recipe.findById(id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

    if (recipe.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const result = await Recipe.findByIdAndUpdate(id, updatedRecipe, { new: true });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error updating recipe' });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;

  console.log('DELETE request received for ID:', id);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: 'Invalid recipe ID.' });
  }

  try {
    const recipe = await Recipe.findById(id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

    if (recipe.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await recipe.deleteOne();
    res.status(200).json({ message: 'Recipe deleted successfully.' });
  } catch (error) {
    console.error('Error during deletion:', error.message);
    res.status(500).json({ message: 'Internal server error during deletion.' });
  }
});

router.post('/generate-recipe', authMiddleware, async (req, res) => {
  const { prompt } = req.body;

  try {
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) {
          return res.status(500).json({ error: 'OpenAI API key is not configured.' });
      }

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
      console.log('Generated Recipe Content:', generatedContent);

      generatedContent = generatedContent.trim().replace(/^\s+/gm, '');
      console.log('Normalized Recipe Content:', generatedContent);

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

      let imageUrl = 'https://via.placeholder.com/400';
      try {
          const imageResponse = await axios.post(
              'https://api.openai.com/v1/images/generations',
              {
                  prompt: `A high-quality image of ${title}, beautifully plated, professional food photography.`,
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
          console.log('AI Generated Image:', imageUrl);
      } catch (imageError) {
          console.error('Error generating AI image:', imageError.message);
          console.log('Falling back to placeholder image.');
      }
      const newRecipe = new Recipe({
          title,
          ingredients,
          instructions: instructions.join('\n'),
          image: imageUrl,
          user: req.user.id, 
      });

      console.log('Saving AI Recipe:', newRecipe);
      const savedRecipe = await newRecipe.save();
      console.log('AI Recipe Successfully Saved:', savedRecipe);
      res.status(201).json(savedRecipe);
  } catch (error) {
      console.error('Error generating recipe:', error.message, error.response?.data || '');
      res.status(500).json({ error: 'Failed to generate recipe.', details: error.message });
  }
});


module.exports = router;

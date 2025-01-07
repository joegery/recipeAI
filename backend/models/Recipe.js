const mongoose = require('mongoose');

const recipeSchema = mongoose.Schema({
  title: { type: String, required: true },
  ingredients: { type: [String], required: true },
  instructions: { type: String, required: true },
  image: { type: String }, 
  createdAt: { type: Date, default: new Date() },
});

module.exports = mongoose.model('Recipe', recipeSchema);

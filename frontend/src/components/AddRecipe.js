import React, { useState } from 'react';

const AddRecipe = ({ onRecipeAdded }) => {
  const [showForm, setShowForm] = useState(false);
  const [recipe, setRecipe] = useState({
    title: '',
    ingredients: '',
    instructions: '',
    image: '', // New field for image
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecipe({ ...recipe, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setRecipe({ ...recipe, image: reader.result });
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const newRecipe = {
      ...recipe,
      ingredients: recipe.ingredients.split(',').map((item) => item.trim()),
    };
  
    try {
      console.log('Submitting recipe:', newRecipe);
      await onRecipeAdded(newRecipe); // Invoke parent callback
      setRecipe({ title: '', ingredients: '', instructions: '', image: '' });
      setShowForm(false); // Close the form only after successful addition
    } catch (error) {
      console.error('Error adding recipe:', error);
      alert('Failed to add recipe. Please try again.');
    }
  };
  

  return (
    <div className="text-center mb-4">
      {!showForm && (
        <button className="btn btn-info my-3" onClick={() => setShowForm(true)}>
          Add New Recipe
        </button>
      )}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mx-auto p-4 border rounded shadow"
          style={{ maxWidth: '500px' }}
        >
          <h3 className="mb-3">Add a New Recipe</h3>
          <div className="mb-3">
            <input
              type="text"
              name="title"
              value={recipe.title}
              onChange={handleChange}
              className="form-control"
              placeholder="Title"
              required
            />
          </div>
          <div className="mb-3">
            <textarea
              name="ingredients"
              value={recipe.ingredients}
              onChange={handleChange}
              className="form-control"
              placeholder="Ingredients (comma-separated)"
              rows="3"
              required
            ></textarea>
          </div>
          <div className="mb-3">
            <textarea
              name="instructions"
              value={recipe.instructions}
              onChange={handleChange}
              className="form-control"
              placeholder="Instructions"
              rows="5"
              required
            ></textarea>
          </div>
          <div className="mb-3">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="form-control"
            />
          </div>
          <div className="d-flex justify-content-between">
            <button type="submit" className="btn btn-primary">
              Add Recipe
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AddRecipe;

import React, { useState } from 'react';

const RecipeModal = ({ recipe, onClose, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false); // Toggle between view and edit modes
  const [updatedRecipe, setUpdatedRecipe] = useState(recipe); // Store updated recipe data

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedRecipe({ ...updatedRecipe, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(updatedRecipe); // Trigger the update function
    setIsEditing(false); // Exit edit mode after updating
  };

  if (!recipe) return null;

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {isEditing ? 'Edit Recipe' : recipe.title}
            </h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body">
            {/* Edit Mode */}
            {isEditing ? (
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <input
                    type="text"
                    name="title"
                    value={updatedRecipe.title}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Title"
                    required
                  />
                </div>
                <div className="mb-3">
                  <textarea
                    name="ingredients"
                    value={updatedRecipe.ingredients.join(', ')}
                    onChange={(e) =>
                      setUpdatedRecipe({
                        ...updatedRecipe,
                        ingredients: e.target.value.split(',').map((item) => item.trim()),
                      })
                    }
                    className="form-control"
                    placeholder="Ingredients (comma-separated)"
                    rows="3"
                    required
                  ></textarea>
                </div>
                <div className="mb-3">
                  <textarea
                    name="instructions"
                    value={updatedRecipe.instructions}
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
                    onChange={(e) => {
                      const file = e.target.files[0];
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setUpdatedRecipe({ ...updatedRecipe, image: reader.result });
                      };
                      if (file) reader.readAsDataURL(file);
                    }}
                    className="form-control"
                  />
                </div>
                <div className="d-flex justify-content-between">
                  <button type="submit" className="btn btn-success">
                    Save Changes
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              // View Mode
              <div>
                {recipe.image && (
                  <img src={recipe.image} alt={recipe.title} className="img-fluid mb-3" />
                )}
                <h6>Ingredients:</h6>
                <p>{recipe.ingredients.join(', ')}</p>
                <h6>Instructions:</h6>
                <p>{recipe.instructions}</p>
              </div>
            )}
          </div>

          <div className="modal-footer">
            {!isEditing && (
              <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
                Update Recipe
              </button>
            )}
            <button className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeModal;

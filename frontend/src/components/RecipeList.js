import React, { useState } from 'react';
import RecipeItem from './RecipeItem';
import RecipeModal from './RecipeModal';

const RecipeList = ({ recipes, onRefresh }) => {
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/recipes/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        onRefresh();
      }
    } catch (error) {
      console.error('Error deleting recipe:', error);
    }
  };

  const handleUpdate = async (updatedRecipe) => {
    try {
      const response = await fetch(`http://localhost:5000/api/recipes/${updatedRecipe._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedRecipe),
      });
      if (response.ok) {
        onRefresh(); // Refresh recipes after updating
        setSelectedRecipe(null); // Close the modal
      }
    } catch (error) {
      console.error('Error updating recipe:', error);
    }
  };

  return (
    <div>
      <div className="row">
        {recipes.map((recipe) => (
          <div key={recipe._id} className="col-md-4">
            <RecipeItem
              recipe={recipe}
              onDelete={handleDelete}
              onOpenModal={setSelectedRecipe}
            />
          </div>
        ))}
      </div>
      {selectedRecipe && (
        <RecipeModal
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
};

export default RecipeList;

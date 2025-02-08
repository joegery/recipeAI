import React, { useState } from 'react';
import RecipeItem from './RecipeItem';
import RecipeModal from './RecipeModal';

const RecipeList = ({ recipes, onRefresh }) => {
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found. User is not authenticated.');
        return;
      }
  
      const response = await fetch(`http://localhost:5000/api/recipes/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        const errorMessage = await response.json();
        throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorMessage.message}`);
      }
  
      onRefresh(); 
    } catch (error) {
      console.error('Error deleting recipe:', error);
    }
  };
  

  const handleUpdate = async (updatedRecipe) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found. User is not authenticated.');
        return;
      }
  
      const response = await fetch(`http://localhost:5000/api/recipes/${updatedRecipe._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedRecipe),
      });
  
      if (!response.ok) {
        const errorMessage = await response.json();
        throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorMessage.message}`);
      }
  
      onRefresh();
      setSelectedRecipe(null); 
    } catch (error) {
      console.error('Error updating recipe:', error);
    }
  };
  

  return (
    <div>
      <div className="row">
        {Array.isArray(recipes) ? (
          recipes.map((recipe) => (
            <div key={recipe._id} className="col-md-4">
              <RecipeItem
                recipe={recipe}
                onDelete={handleDelete}
                onOpenModal={setSelectedRecipe}
              />
            </div>
          ))
        ) : (
          <p>Loading recipes or no recipes found...</p>
        )}
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

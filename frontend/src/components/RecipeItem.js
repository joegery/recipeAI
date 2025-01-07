import React from 'react';
import { FaTrash } from 'react-icons/fa'; // Import trash icon from react-icons

const RecipeItem = ({ recipe, onDelete, onOpenModal }) => {
  const cardStyle = {
    backgroundImage: `url(${recipe.image})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '200px',
    color: 'white',
    position: 'relative',
    borderRadius: '10px',
    overflow: 'hidden',
  };

  return (
    <div className="card mb-3 shadow" style={cardStyle} onClick={() => onOpenModal(recipe)}>
      <div className="card-body" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <h5 className="card-title text-center">{recipe.title}</h5>
      </div>
      {/* Sleek Delete Button */}
      <button
        className="btn btn-sm btn-danger position-absolute top-0 end-0 m-2"
        style={{ borderRadius: '50%' }} // Small, circular button
        onClick={(e) => {
          e.stopPropagation(); // Prevent triggering the modal
          onDelete(recipe._id);
        }}
      >
        <FaTrash size={12} /> {/* Small trash icon */}
      </button>
    </div>
  );
};

export default RecipeItem;

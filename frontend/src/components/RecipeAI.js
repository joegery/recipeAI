import React, { useState } from 'react';

const RecipeAI = ({ onRecipeAdded }) => {
  const [showAIBox, setShowAIBox] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [status, setStatus] = useState('');

  const handleToggleAIBox = () => {
    setShowAIBox((prev) => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Generating recipe...');
  
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setStatus('Error: User not authenticated');
        console.error('No token found, AI request unauthorized.');
        return;
      }
  
      const response = await fetch('http://localhost:5000/api/recipes/generate-recipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ prompt }),
      });
  
      if (!response.ok) {
        const errorMessage = await response.json();
        throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorMessage.message}`);
      }
  
      const data = await response.json();
      console.log('AI Recipe Generated Successfully:', data);
  
      onRecipeAdded(data);
      setStatus('Recipe generated successfully!');
      setPrompt('');
    } catch (error) {
      console.error('Error generating recipe:', error);
      setStatus('Failed to generate recipe. Please try again.');
    }
  };

  return (
    <div>
      <button
        className="btn btn-info mb-3"
        onClick={handleToggleAIBox}
        style={{ position: 'fixed', top: '20px', right: '120px', zIndex: 1000 }}
      >
        {showAIBox ? 'Close AI' : 'Generate Recipe with AI'}
      </button>
      <button
        className="btn btn-danger mb-3"
        onClick={handleLogout}
        style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 1000 }}
      >
        Logout
      </button>
      {showAIBox && (
        <div
          className="p-3 border rounded shadow bg-light"
          style={{
            maxWidth: '300px',
            position: 'fixed',
            right: '20px',
            top: '70px',
            zIndex: 999,
          }}
        >
          <h5 className="text-center">Hi, I'm Recipe AI!</h5>
          <p className="text-muted">What recipe do you want to add?</p>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Type recipe idea..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Generate Recipe
            </button>
          </form>
          {status && <p className="mt-2 text-center text-muted">{status}</p>}
        </div>
      )}
    </div>
  );
};

export default RecipeAI;

import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api/recipes' });

export const fetchRecipes = () => API.get('/');
export const createRecipe = (recipe) => API.post('/', recipe);
export const updateRecipe = (id, updatedData) => API.patch(`/${id}`, updatedData);
export const deleteRecipe = (id) => {
    console.log(`Sending DELETE request to URL: /api/recipes/${id}`);
    return API.delete(`/${id}`);
  };
  

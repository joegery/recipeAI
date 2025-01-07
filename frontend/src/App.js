import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home'; // Home page component
import Navbar from './components/Navbar'; // Navbar component

const App = () => {
  return (
    <Router>
      <div>
        {/* Navbar visible on all pages */}
        <Navbar />
        {/* Main content */}
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

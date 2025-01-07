import React from 'react';
import logo from '../assets/chef5.webp'; // Import the logo

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <a className="navbar-brand" href="/">
          <img
            src={logo}
            alt="Recipe AI Logo"
            width="40"
            height="40"
            className="d-inline-block align-text-top me-2"
          />
          Recipe AI
        </a>
      </div>
    </nav>
  );
};

export default Navbar;

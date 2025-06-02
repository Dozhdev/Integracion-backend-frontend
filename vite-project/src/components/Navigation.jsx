import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './styles/Navigation.css';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        className="menu-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <span className="close-icon">✕</span>
        ) : (
          <span className="menu-icon">☰</span>
        )}
      </button>

      <nav className={`main-navigation ${isOpen ? 'open' : ''}`}>
        <NavLink to="/" className="nav-button" activeclassname="active" onClick={() => setIsOpen(false)}>
          Home
        </NavLink>
        <NavLink to="/project" className="nav-button" activeclassname="active" onClick={() => setIsOpen(false)}>
          Proyecto
        </NavLink>
        <NavLink to="/about" className="nav-button" activeclassname="active" onClick={() => setIsOpen(false)}>
          About
        </NavLink>
      </nav>
    </>
  );
};

export default Navigation;
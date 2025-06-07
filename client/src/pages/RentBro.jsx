import React, { useState } from 'react';
import '../styles/RentBro.css'; // Assuming you have a CSS file for styles

const RentBro = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedBudget, setSelectedBudget] = useState('');

  const categories = [
    { name: 'Buy', active: false },
    { name: 'Rent', active: true },
    { name: 'PG/Co-living', active: false },
    { name: 'Commercial', active: false }
  ];

  const searchTags = [
    'Trending Searches',
    'Uttam Nagar',
    'Sector 44 Noida',
    'Dwarka More',
    'Rajdhon Vihar',
    'More'
  ];

  return (
    <div className="rentbro-container">
      {/* Header */}
      <header className="header">
        <div className="logo">
          <span className="logo-text">RentBro</span>
          <span className="location-text">Delhi</span>
        </div>
        <div className="header-right">
          <button className="list-property-btn">List Property</button>
        </div>
      </header>

      {/* Main Content */}
      <div className="main-content">
        <h1 className="main-title">Search Thousands of Rooms in Delhi</h1>
        
        {/* Category Buttons */}
        <div className="category-buttons">
          {categories.map((category, index) => (
            <button 
              key={index}
              className={`category-btn ${category.active ? 'active' : ''}`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Search Box */}
        <div className="search-container">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <select 
              className="type-select"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="">Type</option>
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="pg">PG</option>
            </select>
            <select 
              className="budget-select"
              value={selectedBudget}
              onChange={(e) => setSelectedBudget(e.target.value)}
            >
              <option value="">Budget</option>
              <option value="0-10000">₹0 - ₹10,000</option>
              <option value="10000-20000">₹10,000 - ₹20,000</option>
              <option value="20000-50000">₹20,000 - ₹50,000</option>
            </select>
            <button className="mic-btn">
              🎤
            </button>
            <button className="search-btn">
              🔍
            </button>
          </div>
        </div>

        {/* Search Tags */}
        <div className="search-tags">
          {searchTags.map((tag, index) => (
            <span key={index} className="search-tag">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button className="nav-arrow nav-arrow-left">‹</button>
      <button className="nav-arrow nav-arrow-right">›</button>

      {/* Bottom Controls */}
      <div className="bottom-controls">
        <button className="control-btn">+</button>
        <button className="control-btn">🔍</button>
        <button className="control-btn">−</button>
      </div>
    </div>
  );
};

export default RentBro;
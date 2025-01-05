import React from "react";
import "./Filter.css";

const Filter = ({ onSpeciesChange}) => {
  return (
    <div className="filter-container">
      
      {/* Species Filter */}
      <select className="filter-dropdown" onChange={onSpeciesChange}>
        <option value="all">All Animals</option>
        <option value="Cattle">Cattle</option>
        <option value="Pig">Pig</option>
        <option value="Sheep">Sheep</option>
        <option value="Goat">Goat</option>
        <option value="Poultry">Poultry</option>
      </select>
      
      {/* Risk Filter */}
      </div>
      
  );
};

export default Filter;

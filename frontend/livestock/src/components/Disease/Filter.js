import React from "react";
import "./Filter.css";

const Filter = ({ onSpeciesChange, onRiskChange }) => {
  return (
    <div className="filter-container">
      <h3>Filter Options</h3>
      
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
      <select className="filter-dropdown" onChange={onRiskChange}>
        <option value="all">All Risks</option>
        <option value="high">High Risk</option>
        <option value="medium">Medium Risk</option>
        <option value="low">Low Risk</option>
      </select>
    </div>
  );
};

export default Filter;

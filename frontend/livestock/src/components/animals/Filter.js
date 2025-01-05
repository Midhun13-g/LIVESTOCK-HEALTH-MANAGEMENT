import React, { useState } from 'react';
import './Filter.css';


const Filter = () => {
  // State for filter visibility
  const [showFilters, setShowFilters] = useState(false);

  // State for selected filters
  const [filters, setFilters] = useState({
    species: '',
    status: '',
    sortBy: 'name'
  });

  // State for filtered data
  const [filteredAnimals, setFilteredAnimals] = useState(animalsData);

  // Toggle visibility of filter section
  const toggleFilters = () => {
    setShowFilters(prevState => !prevState);
  };

  // Handle changes in filter options
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => {
      const newFilters = { ...prevFilters, [name]: value };
      filterAnimals(newFilters); // Apply filters immediately on change
      return newFilters;
    });
  };

  // Function to apply filters on the data
  const filterAnimals = (filters) => {
    let filtered = animalsData;

    // Apply species filter
    if (filters.species) {
      filtered = filtered.filter(animal => animal.species === filters.species);
    }

    // Apply status filter
    if (filters.status) {
      filtered = filtered.filter(animal => animal.status === filters.status);
    }

    // Apply sorting
    if (filters.sortBy === 'name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (filters.sortBy === 'date') {
      filtered.sort((a, b) => new Date(a.birthDate) - new Date(b.birthDate));
    } else if (filters.sortBy === 'checkup') {
      filtered.sort((a, b) => new Date(a.nextCheckup) - new Date(b.nextCheckup));
    }

    // Update the filtered data state
    setFilteredAnimals(filtered);
  };

  return (
    <div className="filters-container">
      <button onClick={toggleFilters} className="filter-button">
        {showFilters ? 'Hide Filters' : 'Show Filters'}
      </button>

      {showFilters && (
        <div className="filters-grid">
          <div>
            <label>Species</label>
            <select name="species" value={filters.species} onChange={handleFilterChange}>
              <option value="">All Species</option>
              <option value="cattle">Cattle</option>
              <option value="pig">Pig</option>
              <option value="sheep">Sheep</option>
            </select>
          </div>
          <div>
            <label>Status</label>
            <select name="status" value={filters.status} onChange={handleFilterChange}>
              <option value="">All Statuses</option>
              <option value="healthy">Healthy</option>
              <option value="treatment">Treatment</option>
              <option value="critical">Critical</option>
            </select>
          </div>
          <div>
            <label>Sort By</label>
            <select name="sortBy" value={filters.sortBy} onChange={handleFilterChange}>
              <option value="name">Name</option>
              <option value="date">Birth Date</option>
              <option value="checkup">Next Checkup</option>
            </select>
          </div>
        </div>
      )}

      {/* Display the filtered list of animals */}
      <div className="animals-list">
        {filteredAnimals.length > 0 ? (
          filteredAnimals.map(animal => (
            <div key={animal.id} className="animal-item">
              <h3>{animal.name}</h3>
              <p>Species: {animal.species}</p>
              <p>Status: {animal.status}</p>
              <p>Birth Date: {animal.birthDate}</p>
              <p>Next Checkup: {animal.nextCheckup}</p>
            </div>
          ))
        ) : (
          <p>No animals found with the selected filters.</p>
        )}
      </div>
    </div>
  );
};

export default Filter;

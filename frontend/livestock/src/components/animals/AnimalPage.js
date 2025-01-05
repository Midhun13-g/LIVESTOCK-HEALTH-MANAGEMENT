import React, { useState } from "react";
import Addanimals from "./Addanimals"; // Import the AddAnimalModal component
import AnimalList from "./AnimalList"; // Import the AnimalList component
import "./AnimalPage.css"; // Import the CSS

const initialAnimals = [
  { id: 1, name: "Bella", species: "Cattle", breed: "Holstein", birthDate: "2020-05-12", nextCheckup: "2024-01-15", status: "healthy" },
  { id: 2, name: "Max", species: "Pig", breed: "Berkshire", birthDate: "2021-03-20", nextCheckup: "2024-03-10", status: "treatment" },
];

const AnimalPage = () => {
  const [animals, setAnimals] = useState(initialAnimals);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({ species: "", status: "", sortBy: "name" });

  const handleAddAnimal = (newAnimal) => {
    setAnimals([...animals, { ...newAnimal, id: animals.length + 1 }]); // Add new animal with unique ID
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    let filtered = initialAnimals;

    if (searchQuery) {
      filtered = filtered.filter((animal) =>
        animal.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filters.species) {
      filtered = filtered.filter((animal) => animal.species.toLowerCase() === filters.species.toLowerCase());
    }

    if (filters.status) {
      filtered = filtered.filter((animal) => animal.status.toLowerCase() === filters.status.toLowerCase());
    }

    if (filters.sortBy === "name") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (filters.sortBy === "date") {
      filtered.sort((a, b) => new Date(a.birthDate) - new Date(b.birthDate));
    } else if (filters.sortBy === "checkup") {
      filtered.sort((a, b) => new Date(a.nextCheckup) - new Date(b.nextCheckup));
    }

    return filtered;
  };

  const filteredAnimals = applyFilters();

  return (
    <div className="animal-page">
      {/* Add Animal Button */}
      <div className="top-bar">
        <button onClick={() => setIsModalOpen(true)} className="add-animal-btn">
          Add New Animal
        </button>
        <button
          onClick={() => setIsFilterOpen(true)}
          className="filter-btn"
          style={{ marginLeft: "10px" }}
        >
          Filters
        </button>
      </div>

      {/* Search Bar */}
      <div className="search-bar-container">
        <input
          type="text"
          placeholder="Search animals by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-bar"
        />
      </div>

      {/* Animal List Section */}
      <AnimalList animals={filteredAnimals} />

      {/* Add Animal Modal */}
      {isModalOpen && (
        <Addanimals onClose={() => setIsModalOpen(false)} onAdd={handleAddAnimal} />
      )}

      {/* Filter Modal */}
      {isFilterOpen && (
        <div className="filter-overlay">
          <div className="filter-modal">
            <h3>Filter Options</h3>
            <div className="filter-options">
              <select name="species" value={filters.species} onChange={handleFilterChange}>
                <option value="">All Species</option>
                <option value="Cattle">Cattle</option>
                <option value="Pig">Pig</option>
                <option value="Sheep">Sheep</option>
              </select>
              <select name="status" value={filters.status} onChange={handleFilterChange}>
                <option value="">All Statuses</option>
                <option value="healthy">Healthy</option>
                <option value="treatment">Treatment</option>
                <option value="critical">Critical</option>
              </select>
              <select name="sortBy" value={filters.sortBy} onChange={handleFilterChange}>
                <option value="name">Name</option>
                <option value="date">Birth Date</option>
                <option value="checkup">Next Checkup</option>
              </select>
            </div>
            <button className="apply-filter-btn" onClick={() => setIsFilterOpen(false)}>
              Apply Filter
            </button>
            <button className="close-filter-btn" onClick={() => setIsFilterOpen(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnimalPage;

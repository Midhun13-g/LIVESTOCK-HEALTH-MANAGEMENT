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
  const [searchQuery, setSearchQuery] = useState("");

  const handleAddAnimal = (newAnimal) => {
    setAnimals([...animals, { ...newAnimal, id: animals.length + 1 }]); // Add new animal with unique ID
  };

  const filteredAnimals = animals.filter((animal) =>
    animal.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="animal-page">
      {/* Add Animal Button */}
      <div className="top-bar">
        <button
          onClick={() => setIsModalOpen(true)}
          className="add-animal-btn"
        >
          Add New Animal
        </button>
      </div>

      {/* Search Bar */}
      <div className="search-filter">
        <input
          type="text"
          placeholder="Search animals by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-bar"
        />
        <button className="filter-btn">
          Filter
        </button>
      </div>

      {/* Animal List Section */}
      <AnimalList animals={filteredAnimals} />

      {/* Add Animal Modal */}
      {isModalOpen && (
        <Addanimals
          onClose={() => setIsModalOpen(false)}
          onAdd={handleAddAnimal}
        />
      )}
    </div>
  );
};

export default AnimalPage;

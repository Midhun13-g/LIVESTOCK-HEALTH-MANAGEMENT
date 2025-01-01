import React, { useState } from "react";
import Addanimals from "./Addanimals";
import AnimalList from "./AnimalList";
import "./AnimalPage.css";

const AnimalPage = () => {
  const [animals, setAnimals] = useState([]); // Initially empty array, as it should come from the backend
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleAddAnimal = (newAnimal) => {
    // Check if the new animal already exists in the list (based on ID)
    setAnimals((prevAnimals) => {
      const isDuplicate = prevAnimals.some((animal) => animal.id === newAnimal.id);
      if (isDuplicate) {
        console.log('Duplicate animal detected.');
        return prevAnimals; // Avoid duplicates by returning the current list
      }
      // Add new animal if not a duplicate
      return [...prevAnimals, { ...newAnimal, id: prevAnimals.length + 1 }];
    });
  };

  const filteredAnimals = animals.filter((animal) =>
    animal.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="animal-page">
      <div className="top-bar">
        <button onClick={() => setIsModalOpen(true)} className="add-animal-btn">
          Add New Animal
        </button>
      </div>

      <div className="search-filter">
        <input
          type="text"
          placeholder="Search animals by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-bar"
        />
        <button className="filter-btn">Filter</button>
      </div>

      <AnimalList animals={filteredAnimals} />

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

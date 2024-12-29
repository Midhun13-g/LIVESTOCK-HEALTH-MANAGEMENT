import React, { useState, useEffect } from "react";
import AnimalCard from "../AnimalCard";
import "./AnimalList.css";

const AnimalList = ({ animals }) => {
  const [animalList, setAnimalList] = useState(animals);

  // Update animalList when the animals prop changes
  useEffect(() => {
    setAnimalList(animals);
  }, [animals]);

  // Function to handle removing an animal by id
  const removeAnimal = (id) => {
    setAnimalList(animalList.filter((animal) => animal.id !== id));
  };

  // Function to handle saving an updated animal
  const handleSave = (updatedAnimal) => {
    setAnimalList((prevState) =>
      prevState.map((animal) =>
        animal.id === updatedAnimal.id ? updatedAnimal : animal
      )
    );
  };

  // Function to handle scheduling a checkup
  const handleScheduleCheckup = (id) => {
    console.log("Schedule checkup for animal with id:", id);
  };

  return (
    <div className="animal-list">
      {animalList.map((animal) => (
        <AnimalCard
          key={animal.id}
          id={animal.id}
          name={animal.name}
          type={animal.type}
          status={animal.status}
          born={animal.born}
          nextCheckup={animal.nextCheckup}
          insemination={animal.insemination}
          onRemove={removeAnimal}  // Pass remove function
          onSave={handleSave}      // Pass save function
          onScheduleCheckup={handleScheduleCheckup}  // Pass schedule checkup function
        />
      ))}
    </div>
  );
};

export default AnimalList;

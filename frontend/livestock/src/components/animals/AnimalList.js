import React, { useState } from "react";
import AnimalCard from "../AnimalCard";
import "./AnimalList.css";

const AnimalList = ({ animals }) => {
  const [animalList, setAnimalList] = useState(animals);

  // Function to handle removing an animal by id
  const removeAnimal = (id) => {
    setAnimalList(animalList.filter((animal) => animal.id !== id));
  };

  const handleSave = (updatedAnimal) => {
    setAnimalList((prevState) =>
      prevState.map((animal) =>
        animal.id === updatedAnimal.id ? updatedAnimal : animal
      )
    );
  };

  const handleScheduleCheckup = (id) => {
    console.log("Schedule checkup for animal with id:", id);
  };

  return (
    <div className="animal-list">
      {animalList.map((animal) => (
        <AnimalCard
          key={animal.id}
          id={animal.id}  // Pass animal's id
          name={animal.name}
          type={animal.type}
          status={animal.status}
          born={animal.born}
          nextCheckup={animal.nextCheckup}
          insemination={animal.insemination}
          onRemove={removeAnimal}  // Pass the remove function
          onSave={handleSave}  // Pass the save function
          onScheduleCheckup={handleScheduleCheckup}  // Pass the schedule checkup function
        />
      ))}
    </div>
  );
};

export default AnimalList;

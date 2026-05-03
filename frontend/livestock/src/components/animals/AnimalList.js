import React from "react";
import AnimalCard from "../AnimalCard";
import "./AnimalList.css";

const AnimalList = ({ animals, onRemove, onSave }) => (
  <div className="animal-list">
    {animals.map((animal) => (
      <AnimalCard
        key={animal.id}
        {...animal}
        onRemove={onRemove}
        onSave={onSave}
      />
    ))}
  </div>
);

export default AnimalList;

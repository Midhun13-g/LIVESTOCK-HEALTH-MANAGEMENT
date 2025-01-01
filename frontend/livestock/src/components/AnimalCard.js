import React, { useEffect, useState } from "react";
import "./AnimalCard.css";

function AnimalCard() {
  const [animals, setAnimals] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch animals from the backend
  const fetchAnimals = async () => {
    setIsLoading(true); // Start loading
    try {
      const token = localStorage.getItem("token"); // Retrieve token from localStorage
      if (!token) {
        throw new Error("User is not authenticated. Token is missing.");
      }

      const response = await fetch("http://localhost:8000/animals/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      if (Array.isArray(data)) {
        setAnimals(data); // Set animals in the state if the data is an array
      } else {
        throw new Error("Fetched data is not an array");
      }

      setError(null); // Clear any previous errors
    } catch (err) {
      setError(err.message); // Set error message
      setAnimals([]); // Clear animals data on error
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    fetchAnimals(); // Call fetchAnimals once when the component mounts
  }, []); // Empty dependency array ensures this effect runs only once on mount

  // Function to handle adding a new animal
  const addNewAnimal = (newAnimal) => {
    // Check if the new animal already exists in the list (based on ID)
    setAnimals((prevAnimals) => {
      const isDuplicate = prevAnimals.some((animal) => animal.id === newAnimal.id);
      if (isDuplicate) {
        console.log('Duplicate animal detected.');
        return prevAnimals; // Return the previous animals list if duplicate
      }
      // Add new animal if not a duplicate
      return [...prevAnimals, newAnimal];
    });
  };

  if (isLoading) {
    return <p>Loading animals...</p>;
  }

  if (error) {
    return <p className="error-message">Error: {error}</p>;
  }

  return (
    <div className="animal-card-container">
      {animals.length === 0 ? (
        <p>No animals found.</p>
      ) : (
        animals.map((animal) => (
          <div key={animal.id} className="animal-card">
            <div className="animal-card-header">
              <h2 className="animal-card-title">{animal.name}</h2>
              <p className="animal-card-type">{animal.species}</p>
            </div>
            <div className="animal-card-details">
              <div className="info-row">
                <p className="info-label">Status:</p>
                <p className={`status-${animal.status} info-value`}>{animal.status}</p>
              </div>
              <div className="info-row">
                <p className="info-label">Breed:</p>
                <p className="info-value">{animal.breed}</p>
              </div>
              <div className="info-row">
                <p className="info-label">Born:</p>
                <p className="info-value">{new Date(animal.dob).toLocaleDateString()}</p>
              </div>
              <div className="info-row">
                <p className="info-label">Next Checkup:</p>
                <p className="info-value">
                  {animal.next_checkup ? new Date(animal.next_checkup).toLocaleDateString() : "Not Scheduled"}
                </p>
              </div>
              <div className="info-row">
                <p className="info-label">Weight:</p>
                <p className="info-value">
                  {animal.weight !== undefined && animal.weight !== null ? `${animal.weight} kg` : "Not provided"}
                </p>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default AnimalCard;

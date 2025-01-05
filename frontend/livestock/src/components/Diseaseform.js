import React, { useState } from "react";
import "./Diseaseform.css";
import axios from "axios";

const DiseaseForm = () => {
  const [animal, setAnimal] = useState("");
  const [age, setAge] = useState("");
  const [temperature, setTemperature] = useState("");
  const [symptoms, setSymptoms] = useState(["", "", ""]);
  const [predictions, setPredictions] = useState([]);  // Ensure it's an array by default
  const [error, setError] = useState(""); // For error handling

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const requestData = {
      animal,
      age: parseInt(age),
      temperature: parseFloat(temperature),
      symptoms: symptoms.filter((s) => s !== ""),
    };

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/prediction/predict", requestData);
      
      console.log("API response:", response.data);  // Log the full response from the API

      if (response.data.predicted_diseases) {
        setPredictions(response.data.predicted_diseases);  // Set predictions if available
        setError(""); // Clear any previous errors
      } else {
        setError("No predictions found.");
      }
    } catch (error) {
      console.error("Error fetching prediction:", error);
      setPredictions([]);  // Clear predictions if there is an error
      setError("There was an error processing your request.");  // Show error message
    }
  };


  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Animal"
          value={animal}
          onChange={(e) => setAnimal(e.target.value)}
        />
        <input
          type="number"
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />
        <input
          type="number"
          placeholder="Temperature"
          value={temperature}
          onChange={(e) => setTemperature(e.target.value)}
        />
        <input
          type="text"
          placeholder="Symptom 1"
          value={symptoms[0]}
          onChange={(e) => setSymptoms([e.target.value, symptoms[1], symptoms[2]])}
        />
        <input
          type="text"
          placeholder="Symptom 2"
          value={symptoms[1]}
          onChange={(e) => setSymptoms([symptoms[0], e.target.value, symptoms[2]])}
        />
        <input
          type="text"
          placeholder="Symptom 3"
          value={symptoms[2]}
          onChange={(e) => setSymptoms([symptoms[0], symptoms[1], e.target.value])}
        />
        <button type="submit">Predict Disease</button>
      </form>

      {error && <div style={{color: 'red'}}>{error}</div>}  {/* Display error message */}
      
      {predictions && predictions.length > 0 && (
        <div>
          <h3>Predicted Diseases:</h3>
          <ul>
            {predictions.map((prediction, index) => (
              <li key={index}>
                {prediction.disease} (Confidence: {prediction.confidence.toFixed(2)})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DiseaseForm;
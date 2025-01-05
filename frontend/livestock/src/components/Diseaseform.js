import React, { useState } from "react";
import "./Diseaseform.css";
import axios from "axios";

const DiseaseForm = () => {
  const [animal, setAnimal] = useState("");
  const [age, setAge] = useState("");
  const [temperature, setTemperature] = useState("");
  const [symptoms, setSymptoms] = useState(["", "", ""]);
  const [predictions, setPredictions] = useState([]);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    const requestData = {
      animal,
      age: parseInt(age),
      temperature: parseFloat(temperature),
      symptoms: symptoms.filter((s) => s !== ""),
    };

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/prediction/predict",
        requestData
      );

      if (response.data.predicted_diseases) {
        setPredictions(response.data.predicted_diseases);
        setError("");
      } else {
        setError("No predictions found.");
      }
    } catch (error) {
      setPredictions([]);
      setError("There was an error processing your request.");
    }
  };

  return (
    <div className="disease-form-container">
      <form onSubmit={handleSubmit} className="disease-form">
        <input
          type="text"
          className="form-input"
          placeholder="Animal"
          value={animal}
          onChange={(e) => setAnimal(e.target.value)}
        />
        <input
          type="number"
          className="form-input"
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />
        <input
          type="number"
          className="form-input"
          placeholder="Temperature"
          value={temperature}
          onChange={(e) => setTemperature(e.target.value)}
        />
        <input
          type="text"
          className="form-input"
          placeholder="Symptom 1"
          value={symptoms[0]}
          onChange={(e) =>
            setSymptoms([e.target.value, symptoms[1], symptoms[2]])
          }
        />
        <input
          type="text"
          className="form-input"
          placeholder="Symptom 2"
          value={symptoms[1]}
          onChange={(e) =>
            setSymptoms([symptoms[0], e.target.value, symptoms[2]])
          }
        />
        <input
          type="text"
          className="form-input"
          placeholder="Symptom 3"
          value={symptoms[2]}
          onChange={(e) =>
            setSymptoms([symptoms[0], symptoms[1], e.target.value])
          }
        />
        <button type="submit" className="form-button">
          Predict Disease
        </button>
      </form>

      {error && <div className="error-message">{error}</div>}

      {predictions && predictions.length > 0 && (
        <div className="predictions-container">
          <h3 className="predictions-header">Predicted Diseases:</h3>
          <ul className="predictions-list">
            {predictions.map((prediction, index) => (
              <li key={index} className="prediction-item">
                {prediction.disease} (Confidence:{" "}
                {prediction.confidence.toFixed(2)})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DiseaseForm;

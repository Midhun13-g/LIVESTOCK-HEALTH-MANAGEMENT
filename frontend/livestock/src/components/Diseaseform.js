import React, { useState } from "react";
import "./Diseaseform.css";
import api from "../api";

const ANIMALS = ["Cow", "Goat", "Sheep", "Horse", "Pig", "Chicken"];
const SYMPTOMS = ["fever", "coughing", "diarrhea", "lethargy", "swelling", "sneezing", "lameness", "nasal discharge", "blisters", "dehydration", "distress", "loss of appetite"];

const CONFIDENCE_COLOR = (c) => c >= 0.6 ? "#22c55e" : c >= 0.3 ? "#f59e0b" : "#ef4444";

const DiseaseForm = () => {
  const [animal, setAnimal] = useState("");
  const [age, setAge] = useState("");
  const [temperature, setTemperature] = useState("");
  const [symptoms, setSymptoms] = useState(["", "", ""]);
  const [predictions, setPredictions] = useState([]);
  const [explanation, setExplanation] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/api/prediction/predict", {
        animal, age: parseInt(age),
        temperature: parseFloat(temperature),
        symptoms: symptoms.filter(s => s !== ""),
      });
      setPredictions(res.data.predicted_diseases || []);
      setExplanation(res.data.explanation || []);
    } catch (err) {
      setPredictions([]);
      setError(err.response?.data?.detail || "Prediction failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const updateSymptom = (i, val) => {
    const s = [...symptoms];
    s[i] = val;
    setSymptoms(s);
  };

  return (
    <div className="df-page">
      <div className="df-container">
        <div className="df-left">
          <div className="df-header">
            <span className="df-icon">🔬</span>
            <div>
              <h2>Disease Prediction</h2>
              <p>Enter animal details to predict possible diseases</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="df-form">
            <div className="df-section-title">Animal Info</div>
            <div className="df-row">
              <div className="df-field">
                <label>Animal Type</label>
                <select value={animal} onChange={e => setAnimal(e.target.value)} required>
                  <option value="">Select animal</option>
                  {ANIMALS.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              <div className="df-field">
                <label>Age (years)</label>
                <input type="number" min="0" max="30" placeholder="e.g. 3" value={age} onChange={e => setAge(e.target.value)} required />
              </div>
            </div>
            <div className="df-field">
              <label>Body Temperature (°F)</label>
              <input type="number" step="0.1" placeholder="e.g. 103.5" value={temperature} onChange={e => setTemperature(e.target.value)} />
            </div>

            <div className="df-section-title">Symptoms (up to 3)</div>
            {symptoms.map((s, i) => (
              <div className="df-field" key={i}>
                <label>Symptom {i + 1}</label>
                <select value={s} onChange={e => updateSymptom(i, e.target.value)}>
                  <option value="">Select symptom</option>
                  {SYMPTOMS.map(sym => <option key={sym} value={sym}>{sym}</option>)}
                </select>
              </div>
            ))}

            {error && <div className="df-error">⚠️ {error}</div>}

            <button type="submit" className="df-submit" disabled={loading}>
              {loading ? <span className="df-spinner" /> : "🔍 Predict Disease"}
            </button>
          </form>
        </div>

        <div className="df-right">
          {predictions.length === 0 ? (
            <div className="df-empty">
              <span>🐄</span>
              <p>Fill in the form and click Predict to see results</p>
            </div>
          ) : (
            <>
              <h3 className="df-results-title">Prediction Results</h3>
              <div className="df-predictions">
                {predictions.map((p, i) => (
                  <div key={i} className={`df-pred-card ${i === 0 ? "df-pred-top" : ""}`}>
                    {i === 0 && <span className="df-top-badge">Most Likely</span>}
                    <div className="df-pred-name">{p.disease}</div>
                    <div className="df-pred-bar-row">
                      <div className="df-pred-bar-bg">
                        <div className="df-pred-bar-fill" style={{ width: `${p.confidence * 100}%`, background: CONFIDENCE_COLOR(p.confidence) }} />
                      </div>
                      <span className="df-pred-pct" style={{ color: CONFIDENCE_COLOR(p.confidence) }}>
                        {(p.confidence * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {explanation.length > 0 && (
                <div className="df-explanation">
                  <h4>🧠 Why this prediction?</h4>
                  <div className="df-exp-list">
                    {explanation.map((e, i) => (
                      <div key={i} className="df-exp-item">
                        <span className="df-exp-feature">{e.feature}</span>
                        <span className="df-exp-contrib">{e.contribution}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiseaseForm;

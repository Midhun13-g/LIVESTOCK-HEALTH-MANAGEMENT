from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import joblib
import pandas as pd

# Load model and encoders
model = joblib.load("D:\\Codes\\Models\\disease_prediction_model.pkl")
label_encoder_animal = joblib.load("D:\\Codes\\Models\\label_encoder_animal.pkl")
label_encoder_symptom = joblib.load("D:\\Codes\\Models\\label_encoder_symptom.pkl")
label_encoder_disease = joblib.load("D:\\Codes\\Models\\label_encoder_disease.pkl")

# Define the router
router = APIRouter()

class PredictionRequest(BaseModel):
    animal: str
    age: int
    temperature: float = None
    symptoms: list[str]

@router.post("/predict")
async def predict_disease(request: PredictionRequest):
    symptoms = request.symptoms + ["unknown"] * (3 - len(request.symptoms))
    
    try:
        # Encode inputs
        animal_encoded = label_encoder_animal.transform([request.animal])[0]
        symptoms_encoded = [
            label_encoder_symptom.transform([symptom])[0] if symptom in label_encoder_symptom.classes_ else -1
            for symptom in symptoms
        ]
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid input values.")
    
    # Prepare data for prediction
    input_data = pd.DataFrame([[animal_encoded, request.age, request.temperature or 100] + symptoms_encoded],
                              columns=['Animal', 'Age', 'Temperature', 'Symptom 1', 'Symptom 2', 'Symptom 3'])
    input_data = input_data.replace(-1, 0)  # Handle unknown symptoms
    
    probabilities = model.predict_proba(input_data)[0]
    top_indices = probabilities.argsort()[-3:][::-1]
    top_predictions = [(label_encoder_disease.inverse_transform([i])[0], probabilities[i]) for i in top_indices]

    return {"predicted_diseases": [
        {"disease": disease, "confidence": round(confidence, 2)} for disease, confidence in top_predictions
    ]}
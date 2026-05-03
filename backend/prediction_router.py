from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
import joblib
import pandas as pd
import os
from notifications_router import create_notification

BASE_DIR = os.path.dirname(__file__)
MODELS_DIR = os.path.join(BASE_DIR, "models")

# Load models at startup — wrapped so a missing dir doesn't crash unrelated routes
try:
    model                 = joblib.load(os.path.join(MODELS_DIR, "disease_prediction_model.pkl"))
    label_encoder_animal  = joblib.load(os.path.join(MODELS_DIR, "label_encoder_animal.pkl"))
    label_encoder_symptom = joblib.load(os.path.join(MODELS_DIR, "label_encoder_symptom.pkl"))
    label_encoder_disease = joblib.load(os.path.join(MODELS_DIR, "label_encoder_disease.pkl"))
    MODELS_LOADED = True
except FileNotFoundError as e:
    print(f"[prediction_router] WARNING: Model files not found — {e}")
    print(f"[prediction_router] Set MODELS_DIR env var to the folder containing .pkl files.")
    model = label_encoder_animal = label_encoder_symptom = label_encoder_disease = None
    MODELS_LOADED = False

FEATURE_NAMES = ["Animal", "Age", "Temperature", "Symptom 1", "Symptom 2", "Symptom 3"]

class PredictionRequest(BaseModel):
    animal: str
    age: int
    temperature: Optional[float] = None
    symptoms: List[str]

def get_router(get_current_user_dep):
    router = APIRouter()

    @router.get("/supported")
    def get_supported():
        if not MODELS_LOADED:
            raise HTTPException(status_code=503, detail="ML models not loaded. Check MODELS_DIR.")
        return {
            "animals": list(label_encoder_animal.classes_),
            "symptoms": [s for s in label_encoder_symptom.classes_ if s != "unknown"]
        }

    @router.post("/predict")
    async def predict_disease(request: PredictionRequest, current_user=Depends(get_current_user_dep)):
        if not MODELS_LOADED:
            raise HTTPException(status_code=503, detail="ML models not loaded. Check MODELS_DIR.")
        animal = request.animal.strip().capitalize()
        if animal not in label_encoder_animal.classes_:
            raise HTTPException(
                status_code=400,
                detail=f"Animal '{animal}' not supported. Supported: {list(label_encoder_animal.classes_)}"
            )

        symptoms = (request.symptoms + ["unknown"] * 3)[:3]
        animal_encoded = label_encoder_animal.transform([animal])[0]
        symptoms_encoded = [
            label_encoder_symptom.transform([s])[0] if s in label_encoder_symptom.classes_ else 0
            for s in symptoms
        ]

        input_data = pd.DataFrame(
            [[animal_encoded, request.age, request.temperature or 101.5] + symptoms_encoded],
            columns=FEATURE_NAMES
        )

        probabilities = model.predict_proba(input_data)[0]
        top_indices = probabilities.argsort()[-3:][::-1]
        predictions = [
            {
                "disease": label_encoder_disease.inverse_transform([i])[0],
                "confidence": round(float(probabilities[i]), 2)
            }
            for i in top_indices
        ]

        # Explainable AI — feature importances
        importances = model.feature_importances_
        total = sum(importances)
        explanation = [
            {"feature": FEATURE_NAMES[i], "contribution": f"{round(importances[i] / total * 100, 1)}%"}
            for i in sorted(range(len(importances)), key=lambda x: importances[x], reverse=True)
            if importances[i] > 0
        ]

        # Trigger notification for top prediction
        if predictions and predictions[0]["confidence"] > 0.3:
            create_notification(
                username=current_user.username,
                message=f"Disease prediction: {predictions[0]['disease']} ({int(predictions[0]['confidence']*100)}% confidence) for your {animal}",
                notif_type="prediction"
            )

        return {
            "predicted_diseases": predictions,
            "explanation": explanation
        }

    return router

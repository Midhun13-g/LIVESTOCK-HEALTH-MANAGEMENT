from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
import joblib
import pandas as pd
import os
from notifications_router import create_notification

MODELS_DIR = "D:\\Codes\\Models"

model = joblib.load(os.path.join(MODELS_DIR, "disease_prediction_model.pkl"))
label_encoder_animal = joblib.load(os.path.join(MODELS_DIR, "label_encoder_animal.pkl"))
label_encoder_symptom = joblib.load(os.path.join(MODELS_DIR, "label_encoder_symptom.pkl"))
label_encoder_disease = joblib.load(os.path.join(MODELS_DIR, "label_encoder_disease.pkl"))

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
        return {
            "animals": list(label_encoder_animal.classes_),
            "symptoms": [s for s in label_encoder_symptom.classes_ if s != "unknown"]
        }

    @router.post("/predict")
    async def predict_disease(request: PredictionRequest, current_user=Depends(get_current_user_dep)):
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

import joblib
import pandas as pd

# Load model and encoders
model = joblib.load("D:\\Codes\\Models\\disease_prediction_model.pkl")
label_encoder_animal = joblib.load("D:\\Codes\\Models\\label_encoder_animal.pkl")
label_encoder_symptom = joblib.load("D:\\Codes\\Models\\label_encoder_symptom.pkl")
label_encoder_disease = joblib.load("D:\\Codes\\Models\\label_encoder_disease.pkl")

def predict_disease(animal, age, temperature=None, symptoms=None, top_n=3):
    if symptoms is None:
        symptoms = []
    
    # Default missing temperature
    temperature = temperature or 100

    # Fill symptoms list
    symptoms += ["unknown"] * (3 - len(symptoms))

    try:
        animal_encoded = label_encoder_animal.transform([animal])[0]
    except ValueError:
        animal_encoded = -1  # Default for unknown animals
    
    symptoms_encoded = [
        label_encoder_symptom.transform([symptom])[0] if symptom in label_encoder_symptom.classes_ else -1
        for symptom in symptoms
    ]

    input_data = pd.DataFrame([[animal_encoded, age, temperature] + symptoms_encoded],
                              columns=["Animal", "Age", "Temperature", "Symptom 1", "Symptom 2", "Symptom 3"])
    input_data = input_data.replace(-1, 0)  # Replace unknown values

    probabilities = model.predict_proba(input_data)[0]
    top_indices = probabilities.argsort()[-top_n:][::-1]
    top_predictions = [
        {"disease": label_encoder_disease.inverse_transform([idx])[0], "confidence": round(probabilities[idx], 2)}
        for idx in top_indices
    ]
    return top_predictiodels
"""
Livestock Disease Prediction Model Training Script
Generates a realistic 600-row dataset and trains a RandomForestClassifier.
Run: python train_model.py
"""
import pandas as pd
import numpy as np
import joblib
import os
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report

np.random.seed(42)

# Disease definitions: animal → [(disease, temp_range, symptoms, age_range)]
DISEASE_MAP = {
    "Cow": [
        ("Bovine Respiratory Disease", (103, 106), ["coughing", "fever", "nasal discharge"], (1, 5)),
        ("Foot and Mouth Disease",     (103, 105), ["blisters", "lameness", "fever"],        (1, 8)),
        ("Bovine Diarrhea",            (101, 103), ["diarrhea", "lethargy", "dehydration"],  (0, 3)),
        ("Mastitis",                   (101, 104), ["swelling", "fever", "lethargy"],         (2, 8)),
        ("Bloat",                      (101, 102), ["swelling", "distress", "lethargy"],      (1, 6)),
    ],
    "Goat": [
        ("Goat Fever",       (103, 106), ["fever", "lethargy", "loss of appetite"], (1, 5)),
        ("Pneumonia",        (103, 105), ["coughing", "fever", "nasal discharge"],  (0, 4)),
        ("Goat Diarrhea",    (101, 103), ["diarrhea", "dehydration", "lethargy"],   (0, 2)),
        ("Caprine Arthritis",(101, 102), ["lameness", "swelling", "lethargy"],      (2, 8)),
        ("Caseous Lymph.",   (101, 102), ["swelling", "lethargy", "loss of appetite"], (1, 6)),
    ],
    "Sheep": [
        ("Sheep Pox",        (103, 106), ["fever", "blisters", "nasal discharge"],  (0, 4)),
        ("Ovine Pneumonia",  (103, 105), ["coughing", "fever", "lethargy"],         (0, 3)),
        ("Sheep Diarrhea",   (101, 103), ["diarrhea", "dehydration", "lethargy"],   (0, 2)),
        ("Foot Rot",         (101, 102), ["lameness", "swelling", "lethargy"],      (1, 6)),
        ("Listeriosis",      (104, 106), ["fever", "lethargy", "loss of appetite"], (1, 5)),
    ],
    "Horse": [
        ("Equine Influenza", (103, 106), ["coughing", "fever", "nasal discharge"],  (1, 10)),
        ("Laminitis",        (101, 102), ["lameness", "swelling", "lethargy"],      (3, 15)),
        ("Strangles",        (103, 105), ["swelling", "fever", "nasal discharge"],  (1, 5)),
        ("Colic",            (101, 103), ["distress", "lethargy", "loss of appetite"], (1, 12)),
        ("Equine Herpes",    (102, 105), ["fever", "nasal discharge", "lethargy"],  (1, 8)),
    ],
    "Pig": [
        ("Swine Fever",      (104, 107), ["fever", "diarrhea", "lethargy"],         (0, 3)),
        ("Porcine Diarrhea", (101, 103), ["diarrhea", "dehydration", "lethargy"],   (0, 1)),
        ("Swine Flu",        (103, 106), ["coughing", "fever", "nasal discharge"],  (0, 4)),
        ("PRRS",             (103, 105), ["fever", "lethargy", "loss of appetite"], (0, 2)),
        ("Erysipelas",       (104, 106), ["fever", "swelling", "lameness"],         (1, 5)),
    ],
    "Chicken": [
        ("Newcastle Disease", (107, 110), ["sneezing", "coughing", "lethargy"],     (0, 2)),
        ("Avian Influenza",   (107, 110), ["fever", "sneezing", "nasal discharge"], (0, 2)),
        ("Marek's Disease",   (106, 108), ["lethargy", "lameness", "loss of appetite"], (0, 1)),
        ("Fowl Pox",          (105, 107), ["blisters", "lethargy", "loss of appetite"], (0, 2)),
        ("Coccidiosis",       (104, 106), ["diarrhea", "lethargy", "dehydration"],  (0, 1)),
    ],
}

rows = []
for animal, diseases in DISEASE_MAP.items():
    for disease, temp_range, symptoms, age_range in diseases:
        for _ in range(20):  # 20 samples per disease = 600 total
            age = np.random.randint(age_range[0], age_range[1] + 1)
            temp = round(np.random.uniform(*temp_range), 1)
            # Shuffle symptoms slightly for variety
            s = symptoms.copy()
            np.random.shuffle(s)
            s = (s + ["unknown", "unknown", "unknown"])[:3]
            rows.append([animal, age, temp, s[0], s[1], s[2], disease])

df = pd.DataFrame(rows, columns=["Animal", "Age", "Temperature", "Symptom 1", "Symptom 2", "Symptom 3", "Disease"])
df = df.sample(frac=1, random_state=42).reset_index(drop=True)

print(f"Dataset size: {len(df)} rows, {df['Disease'].nunique()} diseases")

# Encode
le_animal  = LabelEncoder()
le_symptom = LabelEncoder()
le_disease = LabelEncoder()

all_symptoms = pd.concat([df["Symptom 1"], df["Symptom 2"], df["Symptom 3"]]).unique().tolist()
le_symptom.fit(all_symptoms)

df["Animal"]    = le_animal.fit_transform(df["Animal"])
df["Symptom 1"] = le_symptom.transform(df["Symptom 1"])
df["Symptom 2"] = le_symptom.transform(df["Symptom 2"])
df["Symptom 3"] = le_symptom.transform(df["Symptom 3"])
df["Disease"]   = le_disease.fit_transform(df["Disease"])

X = df[["Animal", "Age", "Temperature", "Symptom 1", "Symptom 2", "Symptom 3"]]
y = df["Disease"]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = RandomForestClassifier(n_estimators=200, max_depth=15, random_state=42, n_jobs=-1)
model.fit(X_train, y_train)

print("\nClassification Report:")
print(classification_report(y_test, model.predict(X_test), target_names=le_disease.classes_))

os.makedirs("D:\\Codes\\Models", exist_ok=True)
joblib.dump(model,      "D:\\Codes\\Models\\disease_prediction_model.pkl")
joblib.dump(le_animal,  "D:\\Codes\\Models\\label_encoder_animal.pkl")
joblib.dump(le_symptom, "D:\\Codes\\Models\\label_encoder_symptom.pkl")
joblib.dump(le_disease, "D:\\Codes\\Models\\label_encoder_disease.pkl")

print("\nModels saved to D:\\Codes\\Models\\")
print("Supported animals:", list(le_animal.classes_))
print("Supported symptoms:", [s for s in le_symptom.classes_ if s != "unknown"])

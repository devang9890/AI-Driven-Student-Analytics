import os

import joblib
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder


_THIS_DIR = os.path.dirname(__file__)
DATASET_PATH = os.path.join(_THIS_DIR, "data", "risksense_1500_students_dataset.xlsx")
MODEL_DIR = os.path.join(_THIS_DIR, "models")
MODEL_PATH = os.path.join(MODEL_DIR, "risk_model.pkl")
ENCODER_PATH = os.path.join(MODEL_DIR, "label_encoder.pkl")


# -----------------------------
# Load dataset
# -----------------------------
df = pd.read_excel(DATASET_PATH)

X = df[["attendance", "avg_marks", "behaviour"]]
y = df["risk_label"]


# -----------------------------
# Encode labels
# -----------------------------
label_encoder = LabelEncoder()
y_encoded = label_encoder.fit_transform(y)


# -----------------------------
# Train-test split
# -----------------------------
X_train, X_test, y_train, y_test = train_test_split(
    X, y_encoded, test_size=0.2, random_state=42
)


# -----------------------------
# Train model
# -----------------------------
model = RandomForestClassifier(n_estimators=200, random_state=42)
model.fit(X_train, y_train)


# -----------------------------
# Evaluate
# -----------------------------
y_pred = model.predict(X_test)

print("Accuracy:", accuracy_score(y_test, y_pred))
print("\nClassification Report:\n")
print(classification_report(y_test, y_pred, target_names=label_encoder.classes_))


# -----------------------------
# Save model + encoder
# -----------------------------
os.makedirs(MODEL_DIR, exist_ok=True)

joblib.dump(model, MODEL_PATH)
joblib.dump(label_encoder, ENCODER_PATH)

print("\nModel and encoder saved successfully ✅")

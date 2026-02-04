import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
import joblib
import os


# -----------------------------
# Load dataset
# -----------------------------
DATASET_PATH = "student_risk_dataset.csv"

df = pd.read_csv(DATASET_PATH)

X = df[[
    "attendance_percentage",
    "average_marks",
    "lms_score"
]]

y = df["risk"]


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
model = RandomForestClassifier(
    n_estimators=100,
    random_state=42
)

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
os.makedirs("models", exist_ok=True)

joblib.dump(model, "models/risk_model.pkl")
joblib.dump(label_encoder, "models/label_encoder.pkl")

print("\nModel and encoder saved successfully ✅")

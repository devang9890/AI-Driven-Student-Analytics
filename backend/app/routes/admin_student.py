from fastapi import APIRouter, UploadFile, File, HTTPException
from bson import ObjectId
from pydantic import BaseModel
from app.db import students_collection, db
import pandas as pd
from io import BytesIO
import joblib
import os
import numpy as np

# Load ML model
_THIS_DIR = os.path.dirname(__file__)
_MODEL_PATH = os.path.join(os.path.dirname(_THIS_DIR), "ml", "models", "risk_model.pkl")
_ENCODER_PATH = os.path.join(os.path.dirname(_THIS_DIR), "ml", "models", "label_encoder.pkl")

_model = None
_label_encoder = None

def _load_model():
    global _model, _label_encoder
    if _model is not None and _label_encoder is not None:
        return
    if os.path.exists(_MODEL_PATH) and os.path.exists(_ENCODER_PATH):
        _model = joblib.load(_MODEL_PATH)
        _label_encoder = joblib.load(_ENCODER_PATH)
        print(f"ML Model loaded from {_MODEL_PATH}")
    else:
        print(f"Model not found at {_MODEL_PATH}")

_load_model()

# alerts collection from db
alerts_collection = db["alerts"]

router = APIRouter(prefix="/admin", tags=["Admin Student"])


class StudentInput(BaseModel):
	name: str
	attendance: float
	marks: float
	behaviour: float
	fees_paid: bool


def predict_risk(data: StudentInput):
    """
    Predict student risk level using ML model.
    Model output: 0=LOW RISK, 1=MEDIUM RISK, 2=HIGH RISK
    Returns: {"risk_label": "...", "probability": 0.XX}
    """
    try:
        if _model is None or _label_encoder is None:
            raise Exception("Model not loaded")
        
        # Prepare features: [attendance_percentage, average_marks, lms_score]
        features = np.array([[data.attendance, data.marks, int(data.behaviour)]])
        
        # Get prediction and probability
        prediction = _model.predict(features)[0]  # Returns 0, 1, or 2
        probabilities = _model.predict_proba(features)[0]  # Returns [prob_0, prob_1, prob_2]
        
        # Map numeric prediction to risk label
        risk_map = {0: "LOW RISK", 1: "MEDIUM RISK", 2: "HIGH RISK"}
        risk_label = risk_map.get(prediction, "LOW RISK")
        
        # Get probability percentage (highest confidence)
        probability = float(probabilities[prediction]) * 100
        
        print(f"ML PREDICTION: attendance={data.attendance}, marks={data.marks}, behaviour={int(data.behaviour)} -> {risk_label} ({probability:.1f}%)")
        
        return {
            "risk_label": risk_label,
            "probability": probability
        }
    except Exception as e:
        print(f"ML PREDICTION ERROR: {e}. Falling back to rules.")
        score = (data.attendance + data.marks + data.behaviour) / 3
        risk_label = "HIGH RISK" if score < 50 else "LOW RISK"
        return {
            "risk_label": risk_label,
            "probability": 50.0
        }




@router.post("/add-student")
async def add_student(data: StudentInput):
	prediction = predict_risk(data)
	risk_label = prediction["risk_label"]
	probability = prediction["probability"]

	student_doc = {
		"name": data.name,
		"attendance": data.attendance,
		"marks": data.marks,
		"behaviour": data.behaviour,
		"fees_paid": data.fees_paid,
		"risk_level": risk_label,
		"risk_probability": probability,
	}

	await students_collection.insert_one(student_doc)

	# 🚨 ALERT SYSTEM
	if risk_label == "HIGH RISK":
		alert_doc = {
			"student_name": data.name,
			"risk_level": risk_label,
			"risk_probability": probability,
			"status": "ACTIVE",
		}
		await alerts_collection.insert_one(alert_doc)

	return {
		"message": f"Student {data.name} added successfully",
		"risk_level": risk_label,
		"probability": probability
	}


@router.get("/stats")
async def get_dashboard_stats():
	total_students = await students_collection.count_documents({})
	high_risk = await students_collection.count_documents({"risk_level": "HIGH RISK"})
	medium_risk = await students_collection.count_documents({"risk_level": "MEDIUM RISK"})
	low_risk = await students_collection.count_documents({"risk_level": "LOW RISK"})

	return {
		"total_students": total_students,
		"high_risk": high_risk,
		"medium_risk": medium_risk,
		"low_risk": low_risk,
	}


@router.get("/alerts")
async def get_alerts():
	alerts = []
	async for alert in alerts_collection.find({"status": "ACTIVE"}):
		alert["_id"] = str(alert["_id"])  # stringify ObjectId
		alerts.append(alert)

	return alerts


@router.get("/students")
async def get_students(risk: str | None = None):
	query = {}
	if risk:
		query["risk_level"] = risk

	students = []
	async for student in students_collection.find(query):
		student["_id"] = str(student["_id"])  # stringify ObjectId
		students.append(student)

	return students


@router.get("/all-students")
async def get_all_students():
    students = []
    async for student in students_collection.find():
        student["_id"] = str(student["_id"])  # stringify ObjectId
        students.append(student)
    return students


@router.get("/student/{student_id}")
async def get_student(student_id: str):
    try:
        student = await students_collection.find_one({"_id": ObjectId(student_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid student id")

    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    student["_id"] = str(student["_id"])
    return {
        "_id": student.get("_id"),
        "name": student.get("name"),
        "attendance": student.get("attendance"),
        "marks": student.get("marks"),
        "behaviour": student.get("behaviour"),
        "fees_paid": student.get("fees_paid"),
        "risk_level": student.get("risk_level"),
        "probability": student.get("risk_probability", student.get("probability")),
    }


@router.delete("/delete-student/{student_id}")
async def delete_student(student_id: str):
    result = await students_collection.delete_one({"_id": ObjectId(student_id)})

    if result.deleted_count == 1:
        return {"message": "Student deleted successfully"}
    else:
        return {"error": "Student not found"}

@router.post("/upload-excel")
async def upload_excel(file: UploadFile = File(...)):

    try:
        df = pd.read_excel(file.file)

        students_added = []

        for _, row in df.iterrows():

            student_data = {
                "name": str(row.get("name", "")),
                "attendance": float(row.get("attendance", 0)),
                "marks": float(row.get("marks", 0)),
                "behaviour": float(row.get("behaviour", 0)),
                "fees_paid": str(row.get("fees_paid", "False")).lower() == "true"
            }

            prediction = predict_risk(StudentInput(**student_data))
            risk_label = prediction["risk_label"]
            probability = prediction["probability"]

            student_doc = {
                **student_data,
                "risk_level": risk_label,
                "risk_probability": probability
            }

            await students_collection.insert_one(student_doc)

            if risk_label == "HIGH RISK":
                await alerts_collection.insert_one({
                    "student_name": student_data["name"],
                    "risk_level": risk_label,
                    "risk_probability": probability,
                    "status": "ACTIVE"
                })

            students_added.append(student_data["name"])

        return {
            "message": "Excel processed successfully",
            "count": len(students_added)
        }

    except Exception as e:
        return {"error": str(e)}

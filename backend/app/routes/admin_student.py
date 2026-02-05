from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel
from app.db import students_collection, db
import pandas as pd
from io import BytesIO

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
	score = (data.attendance + data.marks + data.behaviour) / 3

	if score < 40:
		return "HIGH RISK"
	elif score < 70:
		return "MEDIUM RISK"
	else:
		return "LOW RISK"


@router.post("/add-student")
async def add_student(data: StudentInput):
	risk = predict_risk(data)

	student_doc = {
		"name": data.name,
		"attendance": data.attendance,
		"marks": data.marks,
		"behaviour": data.behaviour,
		"fees_paid": data.fees_paid,
		"risk_level": risk,
	}

	await students_collection.insert_one(student_doc)

	# 🚨 ALERT SYSTEM
	if risk == "HIGH RISK":
		alert_doc = {
			"student_name": data.name,
			"risk_level": risk,
			"status": "ACTIVE",
		}
		await alerts_collection.insert_one(alert_doc)

	return {
		"message": "Student saved successfully",
		"risk_level": risk,
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

            risk = predict_risk(StudentInput(**student_data))

            student_doc = {
                **student_data,
                "risk_level": risk
            }

            await students_collection.insert_one(student_doc)

            if risk == "HIGH RISK":
                await alerts_collection.insert_one({
                    "student_name": student_data["name"],
                    "risk_level": risk,
                    "status": "ACTIVE"
                })

            students_added.append(student_data["name"])

        return {
            "message": "Excel processed successfully",
            "count": len(students_added)
        }

    except Exception as e:
        return {"error": str(e)}

from fastapi import APIRouter
from pydantic import BaseModel
from app.db import students_collection

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

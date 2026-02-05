from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/admin", tags=["Admin"])


class AddStudentRequest(BaseModel):
	name: str
	attendance: float
	marks: float
	behaviour: float
	fees_paid: bool


def _predict_risk(attendance: float, marks: float, behaviour: float, fees_paid: bool):
	# Simple heuristic (no ML dependency): weighted score + penalty for unpaid fees
	score = 0.4 * attendance + 0.4 * marks + 0.2 * behaviour
	if not fees_paid:
		score -= 10
	score = max(0.0, min(100.0, score))

	if score < 50:
		risk = "HIGH"
	elif score < 70:
		risk = "MEDIUM"
	else:
		risk = "LOW"

	return {
		"score": round(score, 2),
		"risk": risk,
	}


@router.post("/add-student")
def add_student(data: AddStudentRequest):
	# No DB per requirements; return computed risk and echo input
	pred = _predict_risk(
		data.attendance,
		data.marks,
		data.behaviour,
		data.fees_paid,
	)
	return {
		"status": "success",
		"student": data.dict(),
		"prediction": pred,
	}

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.services.feature_engineering import (
    calculate_attendance_percentage,
    calculate_average_marks,
    calculate_lms_score
)
from app.ml.predictor import predict_risk

router = APIRouter(prefix="/prediction", tags=["Prediction"])

@router.get("/risk/{student_id}")
def predict_student_risk(
    student_id: int,
    db: Session = Depends(get_db)
):
    attendance_pct = calculate_attendance_percentage(db, student_id)
    avg_marks = calculate_average_marks(db, student_id)
    lms_score = calculate_lms_score(db, student_id)

    predicted_risk = predict_risk(
        attendance_pct,
        avg_marks,
        lms_score
    )

    return {
        "student_id": student_id,
        "predicted_risk": predicted_risk
    }

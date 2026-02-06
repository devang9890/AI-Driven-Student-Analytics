from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.services.feature_engineering import (
    calculate_attendance_percentage,
    calculate_average_marks,
    calculate_lms_score
)
from app.ml.predictor import predict_risk_with_confidence

router = APIRouter(prefix="/prediction", tags=["Prediction"])


def generate_explanation(attendance_pct: float, avg_marks: float, lms_score: int) -> List[str]:
    """Generate rule-based explanation for AI prediction."""
    explanations = []
    
    if attendance_pct < 70:
        explanations.append("Attendance is below optimal level")
    elif attendance_pct < 75:
        explanations.append("Attendance is borderline")
    
    if avg_marks < 65:
        explanations.append("Academic performance needs improvement")
    elif avg_marks < 70:
        explanations.append("Marks pattern indicates potential risk")
    
    if lms_score < 40:
        explanations.append("Behaviour score is impacting academic risk")
    elif lms_score < 50:
        explanations.append("Behaviour score is low")
    
    if not explanations:
        explanations.append("Student is performing well across all metrics")
    
    return explanations

@router.get("/risk/{student_id}")
def predict_student_risk(
    student_id: int,
    db: Session = Depends(get_db)
):
    attendance_pct = calculate_attendance_percentage(db, student_id)
    avg_marks = calculate_average_marks(db, student_id)
    lms_score = calculate_lms_score(db, student_id)

    predicted_risk, confidence_score = predict_risk_with_confidence(
        attendance_pct,
        avg_marks,
        lms_score
    )
    
    # Generate rule-based explanation
    explanation = generate_explanation(attendance_pct, avg_marks, lms_score)

    return {
        "student_id": student_id,
        "predicted_label": predicted_risk,
        "avg_marks": avg_marks,
        "confidence_score": confidence_score,
        "explanation": explanation
    }

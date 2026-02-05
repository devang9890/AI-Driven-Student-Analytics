from datetime import datetime
from typing import Optional, Dict, Any

from bson import ObjectId

from app.db import alerts_collection
from app.services.feature_engineering import (
    calculate_attendance_percentage,
    calculate_average_marks,
    calculate_lms_score
)

from app.services.decline_service import (
    detect_attendance_decline,
    detect_marks_decline
)


def check_student_alert(db, student_id: int):

    attendance = calculate_attendance_percentage(db, student_id)
    marks = calculate_average_marks(db, student_id)
    lms = calculate_lms_score(db, student_id)

    attendance_decline = detect_attendance_decline(db, student_id)
    marks_decline = detect_marks_decline(db, student_id)

    risk_high = attendance < 60 or marks < 50 or lms < 5
    decline_detected = attendance_decline or marks_decline

    if risk_high and decline_detected:
        return {
            "alert": True,
            "message": "Severe academic decline detected. Immediate intervention required."
        }

    if risk_high:
        return {
            "alert": True,
            "message": "Student at high academic risk."
        }

    if decline_detected:
        return {
            "alert": True,
            "message": "Performance decline detected."
        }

    return {
        "alert": False,
        "message": "Student performance stable."
    }


async def _create_alert_if_not_exists(
    *,
    student_id: str,
    student_name: str,
    alert_type: str,
    message: str,
    severity: str
) -> Optional[Dict[str, Any]]:
    existing = await alerts_collection.find_one({
        "student_id": student_id,
        "alert_type": alert_type,
        "is_read": False
    })

    if existing:
        return None

    alert_doc = {
        "student_id": student_id,
        "student_name": student_name,
        "alert_type": alert_type,
        "message": message,
        "severity": severity,
        "created_at": datetime.utcnow(),
        "is_read": False
    }

    result = await alerts_collection.insert_one(alert_doc)
    alert_doc["_id"] = str(result.inserted_id)
    return alert_doc


async def generate_alerts_for_student(
    *,
    student_after: Dict[str, Any],
    student_before: Optional[Dict[str, Any]] = None
) -> None:
    student_id = str(student_after.get("_id"))
    student_name = student_after.get("name", "Unknown")

    attendance = float(student_after.get("attendance", 0))
    avg_marks = float(student_after.get("average_marks", 0))
    behaviour = float(student_after.get("behaviour", 0))
    risk_level = student_after.get("risk_level", "")
    risk_probability = float(student_after.get("risk_probability", 0))

    if attendance < 40:
        await _create_alert_if_not_exists(
            student_id=student_id,
            student_name=student_name,
            alert_type="ATTENDANCE_LOW",
            message=f"{student_name} attendance dropped below 40%.",
            severity="HIGH"
        )

    if avg_marks < 35:
        await _create_alert_if_not_exists(
            student_id=student_id,
            student_name=student_name,
            alert_type="MARKS_LOW",
            message=f"{student_name} average marks dropped below 35.",
            severity="HIGH"
        )

    if behaviour < 30:
        await _create_alert_if_not_exists(
            student_id=student_id,
            student_name=student_name,
            alert_type="BEHAVIOUR_LOW",
            message=f"{student_name} behaviour score dropped below 30.",
            severity="MEDIUM"
        )

    if risk_probability > 80:
        await _create_alert_if_not_exists(
            student_id=student_id,
            student_name=student_name,
            alert_type="RISK_PROBABILITY_HIGH",
            message=f"{student_name} risk probability exceeded 80%.",
            severity="HIGH"
        )

    if student_before:
        prev_risk = student_before.get("risk_level")
        if prev_risk == "LOW RISK" and risk_level == "HIGH RISK":
            await _create_alert_if_not_exists(
                student_id=student_id,
                student_name=student_name,
                alert_type="RISK_ESCALATION",
                message=f"{student_name} risk level escalated from LOW to HIGH.",
                severity="HIGH"
            )

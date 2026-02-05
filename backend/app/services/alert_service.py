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

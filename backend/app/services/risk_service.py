def get_risk_hint(attendance_pct, avg_marks, lms_score):
    if attendance_pct < 60 or avg_marks < 50:
        return "HIGH"

    if attendance_pct < 75 or avg_marks < 65:
        return "MEDIUM"

    if lms_score < 10:
        return "MEDIUM"

    return "LOW"

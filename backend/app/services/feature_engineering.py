from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.attendance import Attendance
from app.models.marks import Marks
from app.models.lms_activity import LMSActivity


def calculate_attendance_percentage(db: Session, student_id: int):
    total = db.query(Attendance).filter(
        Attendance.student_id == student_id
    ).count()

    if total == 0:
        return 0.0

    present = db.query(Attendance).filter(
        Attendance.student_id == student_id,
        Attendance.present == True
    ).count()

    return round((present / total) * 100, 2)


def calculate_average_marks(db: Session, student_id: int):
    avg = db.query(func.avg(Marks.score)).filter(
        Marks.student_id == student_id
    ).scalar()

    return round(avg, 2) if avg else 0.0


def calculate_lms_score(db: Session, student_id: int):
    activities = db.query(LMSActivity).filter(
        LMSActivity.student_id == student_id
    ).all()

    if not activities:
        return 0

    score = 0
    for a in activities:
        score += a.login_count + a.assignments_submitted * 2

    return score

from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.models.attendance import Attendance
from app.models.marks import Marks


def detect_attendance_decline(db: Session, student_id: int):
    records = (
        db.query(Attendance)
        .filter(Attendance.student_id == student_id)
        .order_by(desc(Attendance.date))
        .limit(6)
        .all()
    )

    if len(records) < 4:
        return False

    recent = records[:3]
    older = records[3:]

    recent_pct = sum(1 for r in recent if r.present) / len(recent)
    older_pct = sum(1 for r in older if r.present) / len(older)

    return recent_pct < older_pct


def detect_marks_decline(db: Session, student_id: int):
    records = (
        db.query(Marks)
        .filter(Marks.student_id == student_id)
        .order_by(desc(Marks.exam_date))
        .limit(4)
        .all()
    )

    if len(records) < 3:
        return False

    recent_avg = sum(r.score for r in records[:2]) / 2
    older_avg = records[-1].score

    return recent_avg < older_avg

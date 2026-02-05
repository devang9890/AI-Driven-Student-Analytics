from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db

from app.models.attendance import Attendance
from app.models.marks import Marks
from app.models.lms_activity import LMSActivity

from app.schemas.attendance import AttendanceCreate
from app.schemas.marks import MarksCreate
from app.schemas.lms_activity import LMSActivityCreate


router = APIRouter(prefix="/analytics", tags=["Analytics"])


# --------------------------------------------------
# Attendance API
# --------------------------------------------------
@router.post("/attendance")
def add_attendance(
    data: AttendanceCreate,
    db: Session = Depends(get_db)
):
    attendance = Attendance(**data.dict())
    db.add(attendance)
    db.commit()
    db.refresh(attendance)
    return attendance


# --------------------------------------------------
# Marks API
# --------------------------------------------------
@router.post("/marks")
def add_marks(
    data: MarksCreate,
    db: Session = Depends(get_db)
):
    marks = Marks(**data.dict())
    db.add(marks)
    db.commit()
    db.refresh(marks)
    return marks


# --------------------------------------------------
# LMS Activity API
# --------------------------------------------------
@router.post("/lms")
def add_lms_activity(
    data: LMSActivityCreate,
    db: Session = Depends(get_db)
):
    activity = LMSActivity(**data.dict())
    db.add(activity)
    db.commit()
    db.refresh(activity)
    return activity

from app.services.feature_engineering import (
    calculate_attendance_percentage,
    calculate_average_marks,
    calculate_lms_score
)

from app.services.risk_service import get_risk_hint


@router.get("/summary/{student_id}")
def student_summary(
    student_id: int,
    db: Session = Depends(get_db)
):
    attendance_pct = calculate_attendance_percentage(db, student_id)
    avg_marks = calculate_average_marks(db, student_id)
    lms_score = calculate_lms_score(db, student_id)

    risk_hint = get_risk_hint(
        attendance_pct,
        avg_marks,
        lms_score
    )

    return {
        "student_id": student_id,
        "attendance_percentage": attendance_pct,
        "average_marks": avg_marks,
        "lms_score": lms_score,
        "risk_hint": risk_hint
    }

from app.services.decline_service import (
    detect_attendance_decline,
    detect_marks_decline
)


@router.get("/decline/{student_id}")
def performance_decline(
    student_id: int,
    db: Session = Depends(get_db)
):
    attendance_decline = detect_attendance_decline(db, student_id)
    marks_decline = detect_marks_decline(db, student_id)

    return {
        "student_id": student_id,
        "attendance_decline": attendance_decline,
        "marks_decline": marks_decline,
        "overall_decline": attendance_decline or marks_decline
    }

# -----------------------------
# Attendance trend
# -----------------------------
@router.get("/attendance-trend/{student_id}")
def attendance_trend(student_id: int, db: Session = Depends(get_db)):
    records = (
        db.query(Attendance)
        .filter(Attendance.student_id == student_id)
        .order_by(Attendance.date)
        .all()
    )

    return [
        {
            "label": r.date.strftime("%d %b"),
            "value": 1 if r.present else 0,
        }
        for r in records
    ]


# -----------------------------
# Marks trend
# -----------------------------
@router.get("/marks-trend/{student_id}")
def marks_trend(student_id: int, db: Session = Depends(get_db)):
    records = (
        db.query(Marks)
        .filter(Marks.student_id == student_id)
        .order_by(Marks.exam_date)
        .all()
    )

    return [
        {
            "label": r.subject,
            "value": r.score,
        }
        for r in records
    ]


# -----------------------------
# LMS activity trend
# -----------------------------
@router.get("/lms-trend/{student_id}")
def lms_trend(student_id: int, db: Session = Depends(get_db)):
    records = (
        db.query(LMSActivity)
        .filter(LMSActivity.student_id == student_id)
        .order_by(LMSActivity.week)
        .all()
    )

    return [
        {
            "label": f"Week {r.week}",
            "value": r.login_count + r.assignments_submitted,
        }
        for r in records
    ]


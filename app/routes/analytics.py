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

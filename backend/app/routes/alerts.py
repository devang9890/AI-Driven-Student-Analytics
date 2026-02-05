from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.services.alert_service import check_student_alert

router = APIRouter(prefix="/alerts", tags=["Alerts"])


@router.get("/check/{student_id}")
def check_alert(student_id: int, db: Session = Depends(get_db)):
    result = check_student_alert(db, student_id)

    return {
        "student_id": student_id,
        **result
    }

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from bson import ObjectId

from app.database import get_db
from app.db import alerts_collection
from app.services.alert_service import check_student_alert
from app.routes.admin_auth import get_current_admin

router = APIRouter(prefix="/alerts", tags=["Alerts"])


@router.get("/check/{student_id}")
def check_alert(student_id: int, db: Session = Depends(get_db)):
    result = check_student_alert(db, student_id)

    return {
        "student_id": student_id,
        **result
    }


@router.get("")
async def get_all_alerts(_: dict = Depends(get_current_admin)):
    alerts = []
    cursor = alerts_collection.find().sort("created_at", -1)
    async for alert in cursor:
        alert["_id"] = str(alert["_id"])
        alerts.append(alert)
    return alerts


@router.get("/student/{student_id}")
async def get_alerts_for_student(student_id: str, _: dict = Depends(get_current_admin)):
    alerts = []
    cursor = alerts_collection.find({"student_id": student_id}).sort("created_at", -1)
    async for alert in cursor:
        alert["_id"] = str(alert["_id"])
        alerts.append(alert)
    return alerts


@router.patch("/{alert_id}/read")
async def mark_alert_read(alert_id: str, _: dict = Depends(get_current_admin)):
    try:
        oid = ObjectId(alert_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid alert id")

    result = await alerts_collection.update_one(
        {"_id": oid},
        {"$set": {"is_read": True}}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Alert not found")

    return {"message": "Alert marked as read"}

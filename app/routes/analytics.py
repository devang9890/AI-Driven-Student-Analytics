from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.student import Student

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/health")
def health():
	return {"status": "ok"}

@router.get("/students/count")
def students_count(db: Session = Depends(get_db)):
	return {"count": db.query(Student).count()}
from fastapi import APIRouter

router = APIRouter(prefix="/analytics", tags=["Analytics"])

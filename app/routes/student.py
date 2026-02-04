from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.student import Student

router = APIRouter(prefix="/students", tags=["Students"])

@router.post("/")
def create_student(
    name: str,
    department: str,
    year: int,
    db: Session = Depends(get_db)
):
    student = Student(
        name=name,
        department=department,
        year=year
    )
    db.add(student)
    db.commit()
    db.refresh(student)
    return student


@router.get("/")
def get_students(db: Session = Depends(get_db)):
    return db.query(Student).all()

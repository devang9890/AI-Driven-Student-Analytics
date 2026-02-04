from pydantic import BaseModel
from datetime import date

class MarksCreate(BaseModel):
    student_id: int
    subject: str
    score: float
    exam_date: date

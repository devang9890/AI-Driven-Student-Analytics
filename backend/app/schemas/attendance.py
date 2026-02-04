from pydantic import BaseModel
from datetime import date

class AttendanceCreate(BaseModel):
    student_id: int
    date: date
    present: bool

from pydantic import BaseModel

class LMSActivityCreate(BaseModel):
    student_id: int
    login_count: int
    assignments_submitted: int
    week: int

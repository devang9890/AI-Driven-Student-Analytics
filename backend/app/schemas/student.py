from pydantic import BaseModel

class StudentCreate(BaseModel):
    name: str
    department: str
    year: int

class StudentResponse(StudentCreate):
    id: int

    class Config:
        from_attributes = True

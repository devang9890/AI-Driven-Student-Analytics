from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class LMSActivity(Base):
    __tablename__ = "lms_activity"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    login_count = Column(Integer)
    assignments_submitted = Column(Integer)
    week = Column(Integer)

    student = relationship("Student", backref="lms_activity")

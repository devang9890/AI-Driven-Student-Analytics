"""
Generate realistic academic data for student_id=1.

Run:
    python -m app.scripts.generate_sample_data
"""
from datetime import date, timedelta
import random
from typing import List

from sqlalchemy.orm import Session
from sqlalchemy import exists, and_

from app.database import SessionLocal
from app.models.attendance import Attendance
from app.models.marks import Marks
from app.models.lms_activity import LMSActivity

STUDENT_ID = 1


def get_session() -> Session:
    return SessionLocal()


def generate_attendance(db: Session, student_id: int) -> None:
    """Generate 30 days of attendance with a declining trend.
    Avoid duplicates per (student_id, date).
    """
    today = date.today()
    days = 30
    # Start with high presence probability, gradually decrease
    start_prob = 0.9
    end_prob = 0.4
    step = (start_prob - end_prob) / max(days - 1, 1)

    for i in range(days):
        day = today - timedelta(days=(days - 1 - i))
        prob_present = start_prob - step * i
        present = random.random() < prob_present

        # Skip if record already exists for this day
        exists_q = db.query(
            exists().where(
                and_(Attendance.student_id == student_id, Attendance.date == day)
            )
        ).scalar()
        if exists_q:
            continue

        db.add(Attendance(student_id=student_id, date=day, present=present))

    db.commit()


def generate_marks(db: Session, student_id: int) -> None:
    """Generate marks for 5 subjects, 3 exams each, declining scores.
    Avoid duplicates per (student_id, subject, exam_date).
    """
    subjects: List[str] = ["Maths", "Physics", "Chemistry", "English", "History"]
    # Create three exam dates spaced two weeks apart ending today
    base_date = date.today() - timedelta(weeks=4)
    exam_dates = [base_date, base_date + timedelta(weeks=2), base_date + timedelta(weeks=4)]

    # Scores decline across exams
    base_scores = [80, 70, 60]

    for subj in subjects:
        for idx, exam_date in enumerate(exam_dates):
            base = base_scores[idx]
            # Add small noise and ensure within 35..95
            score = max(35.0, min(95.0, base + random.uniform(-5, 5)))

            exists_q = db.query(
                exists().where(
                    and_(
                        Marks.student_id == student_id,
                        Marks.subject == subj,
                        Marks.exam_date == exam_date,
                    )
                )
            ).scalar()
            if exists_q:
                continue

            db.add(Marks(student_id=student_id, subject=subj, score=score, exam_date=exam_date))

    db.commit()


def generate_lms_activity(db: Session, student_id: int) -> None:
    """Generate 6 weeks of LMS activity with decreasing trend.
    Avoid duplicates per (student_id, week).
    """
    weeks = list(range(1, 7))

    # Define decreasing centers for logins and assignments
    login_centers = [18, 16, 14, 12, 10, 8]
    assign_centers = [4, 3, 3, 2, 2, 1]

    for i, week in enumerate(weeks):
        login_center = login_centers[i]
        assign_center = assign_centers[i]

        login_count = int(max(5, min(20, round(random.gauss(login_center, 2)))))
        assignments_submitted = int(max(0, min(4, round(random.gauss(assign_center, 1)))))

        exists_q = db.query(
            exists().where(
                and_(LMSActivity.student_id == student_id, LMSActivity.week == week)
            )
        ).scalar()
        if exists_q:
            continue

        db.add(
            LMSActivity(
                student_id=student_id,
                login_count=login_count,
                assignments_submitted=assignments_submitted,
                week=week,
            )
        )

    db.commit()


def main():
    db = get_session()
    try:
        generate_attendance(db, STUDENT_ID)
        generate_marks(db, STUDENT_ID)
        generate_lms_activity(db, STUDENT_ID)
        print("Sample data generation complete.")
    finally:
        db.close()


if __name__ == "__main__":
    main()

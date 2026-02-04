import pandas as pd
import random

def generate_student_record():
    attendance = random.randint(40, 100)
    marks = random.randint(30, 95)
    lms_score = random.randint(0, 40)

    # Risk labeling rules (same logic as service)
    if attendance < 60 or marks < 50:
        risk = "HIGH"
    elif attendance < 75 or marks < 65 or lms_score < 10:
        risk = "MEDIUM"
    else:
        risk = "LOW"

    return {
        "attendance_percentage": attendance,
        "average_marks": marks,
        "lms_score": lms_score,
        "risk": risk
    }


def generate_dataset(n=300):
    data = [generate_student_record() for _ in range(n)]
    df = pd.DataFrame(data)
    return df


if __name__ == "__main__":
    df = generate_dataset()
    df.to_csv("student_risk_dataset.csv", index=False)
    print("Dataset generated successfully ✅")

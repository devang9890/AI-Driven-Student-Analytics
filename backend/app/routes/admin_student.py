from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from bson import ObjectId
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
from app.db import students_collection, alerts_collection, notes_collection, db
from app.routes.admin_auth import get_current_admin
from app.services.alert_service import generate_alerts_for_student
from app.ml.predictor import predict_student
import pandas as pd
from io import BytesIO

router = APIRouter(prefix="/admin", tags=["Admin Student"], dependencies=[Depends(get_current_admin)])


# NEW: Subject schema
class Subject(BaseModel):
    subject_name: str = Field(..., alias="subject")
    marks: float
    model_config = ConfigDict(populate_by_name=True)


# UPDATED: Student input with subjects array
class StudentInput(BaseModel):
    name: str = Field(..., alias="student_name")
    attendance: float
    behaviour: float
    fees_paid: Optional[bool] = False
    subjects: List[Subject]
    model_config = ConfigDict(populate_by_name=True)


# Helper to calculate average marks
def calculate_average_marks(subjects: List[dict]) -> float:
    if not subjects:
        return 0.0
    total = sum(s.get("marks", 0) for s in subjects)
    return round(total / len(subjects), 2)


def _map_label_to_risk_level(label: str) -> str:
    label_upper = (label or "").upper()
    if label_upper == "HIGH":
        return "HIGH RISK"
    if label_upper == "MEDIUM":
        return "MEDIUM RISK"
    return "LOW RISK"



@router.post("/add-student")
async def add_student(data: StudentInput):
    # Convert subjects to dict format
    subjects_list = [{"subject_name": s.subject_name, "marks": s.marks} for s in data.subjects]

    # Predict risk using ML
    subject_marks = [s["marks"] for s in subjects_list]
    prediction = predict_student(data.attendance, data.behaviour, subject_marks)
    predicted_label = prediction["predicted_label"]
    confidence_score = prediction["confidence_score"]
    average_marks = prediction["avg_marks"]

    risk_level = _map_label_to_risk_level(predicted_label)
    probability = confidence_score

    student_doc = {
        "name": data.name,
        "attendance": data.attendance,
        "behaviour": data.behaviour,
        "fees_paid": data.fees_paid,
        "subjects": subjects_list,
        "average_marks": average_marks,
        "predicted_label": predicted_label,
        "confidence_score": confidence_score,
        "risk_level": risk_level,
        "risk_probability": probability,
    }

    result = await students_collection.insert_one(student_doc)
    student_doc["_id"] = result.inserted_id

    await generate_alerts_for_student(student_after=student_doc)

    return {
        "message": f"Student {data.name} added successfully",
        "predicted_label": predicted_label,
        "confidence_score": confidence_score,
        "avg_marks": average_marks,
        "risk_level": risk_level,
        "probability": probability
    }


# NEW: Add subject to existing student
@router.post("/add-subject/{student_id}")
async def add_subject(student_id: str, subject: Subject):
    try:
        student = await students_collection.find_one({"_id": ObjectId(student_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid student id")
    
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    student_before = dict(student)
    # Get existing subjects or initialize
    student_before = dict(student)
    student_before = dict(student)
    subjects = student.get("subjects", [])
    
    # Check if subject already exists
    if any(s.get("subject_name") == subject.subject_name for s in subjects):
        raise HTTPException(status_code=400, detail="Subject already exists")
    
    # Add new subject
    subjects.append({"subject_name": subject.subject_name, "marks": subject.marks})
    
    # Recalculate average and prediction
    subject_marks = [s.get("marks", 0) for s in subjects]
    prediction = predict_student(student["attendance"], student["behaviour"], subject_marks)
    predicted_label = prediction["predicted_label"]
    confidence_score = prediction["confidence_score"]
    average_marks = prediction["avg_marks"]
    risk_level = _map_label_to_risk_level(predicted_label)
    
    # Update student
    await students_collection.update_one(
        {"_id": ObjectId(student_id)},
        {"$set": {
            "subjects": subjects,
            "average_marks": average_marks,
            "predicted_label": predicted_label,
            "confidence_score": confidence_score,
            "risk_level": risk_level,
            "risk_probability": confidence_score,
        }}
    )

    student_after = {
        **student_before,
        "subjects": subjects,
        "average_marks": average_marks,
        "predicted_label": predicted_label,
        "confidence_score": confidence_score,
        "risk_level": risk_level,
        "risk_probability": confidence_score,
    }

    await generate_alerts_for_student(student_after=student_after, student_before=student_before)

    student_after = {
        **student_before,
        "subjects": subjects,
        "average_marks": average_marks,
        "predicted_label": predicted_label,
        "confidence_score": confidence_score,
        "risk_level": risk_level,
        "risk_probability": confidence_score,
    }

    await generate_alerts_for_student(student_after=student_after, student_before=student_before)

    student_after = {
        **student_before,
        "subjects": subjects,
        "average_marks": average_marks,
        "predicted_label": predicted_label,
        "confidence_score": confidence_score,
        "risk_level": risk_level,
        "risk_probability": confidence_score,
    }

    await generate_alerts_for_student(student_after=student_after, student_before=student_before)
    
    return {
        "message": "Subject added successfully",
        "average_marks": average_marks,
        "predicted_label": predicted_label,
        "confidence_score": confidence_score,
        "risk_level": risk_level
    }


# NEW: Update subject marks
@router.put("/update-subject/{student_id}/{subject_name}")
async def update_subject(student_id: str, subject_name: str, marks: float):
    try:
        student = await students_collection.find_one({"_id": ObjectId(student_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid student id")
    
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    subjects = student.get("subjects", [])
    
    # Find and update subject
    found = False
    for s in subjects:
        if s.get("subject_name") == subject_name:
            s["marks"] = marks
            found = True
            break
    
    if not found:
        raise HTTPException(status_code=404, detail="Subject not found")
    
    # Recalculate average and prediction
    subject_marks = [s.get("marks", 0) for s in subjects]
    prediction = predict_student(student["attendance"], student["behaviour"], subject_marks)
    predicted_label = prediction["predicted_label"]
    confidence_score = prediction["confidence_score"]
    average_marks = prediction["avg_marks"]
    risk_level = _map_label_to_risk_level(predicted_label)
    
    # Update student
    await students_collection.update_one(
        {"_id": ObjectId(student_id)},
        {"$set": {
            "subjects": subjects,
            "average_marks": average_marks,
            "predicted_label": predicted_label,
            "confidence_score": confidence_score,
            "risk_level": risk_level,
            "risk_probability": confidence_score,
        }}
    )
    
    return {
        "message": "Subject updated successfully",
        "average_marks": average_marks,
        "predicted_label": predicted_label,
        "confidence_score": confidence_score,
        "risk_level": risk_level
    }


# NEW: Delete subject
@router.delete("/delete-subject/{student_id}/{subject_name}")
async def delete_subject(student_id: str, subject_name: str):
    try:
        student = await students_collection.find_one({"_id": ObjectId(student_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid student id")
    
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    subjects = student.get("subjects", [])
    
    # Remove subject
    subjects = [s for s in subjects if s.get("subject_name") != subject_name]
    
    if len(subjects) == len(student.get("subjects", [])):
        raise HTTPException(status_code=404, detail="Subject not found")
    
    # Recalculate average and prediction
    subject_marks = [s.get("marks", 0) for s in subjects]
    prediction = predict_student(student["attendance"], student["behaviour"], subject_marks)
    predicted_label = prediction["predicted_label"]
    confidence_score = prediction["confidence_score"]
    average_marks = prediction["avg_marks"]
    risk_level = _map_label_to_risk_level(predicted_label)
    
    # Update student
    await students_collection.update_one(
        {"_id": ObjectId(student_id)},
        {"$set": {
            "subjects": subjects,
            "average_marks": average_marks,
            "predicted_label": predicted_label,
            "confidence_score": confidence_score,
            "risk_level": risk_level,
            "risk_probability": confidence_score,
        }}
    )
    
    return {
        "message": "Subject deleted successfully",
        "average_marks": average_marks,
        "predicted_label": predicted_label,
        "confidence_score": confidence_score,
        "risk_level": risk_level
    }


@router.get("/stats")
async def get_dashboard_stats():
	total_students = await students_collection.count_documents({})
	high_risk = await students_collection.count_documents({"risk_level": "HIGH RISK"})
	medium_risk = await students_collection.count_documents({"risk_level": "MEDIUM RISK"})
	low_risk = await students_collection.count_documents({"risk_level": "LOW RISK"})

	return {
		"total_students": total_students,
		"high_risk": high_risk,
		"medium_risk": medium_risk,
		"low_risk": low_risk,
	}


@router.get("/alerts")
async def get_alerts():
    alerts = []
    async for alert in alerts_collection.find().sort("created_at", -1):
        alert["_id"] = str(alert["_id"])  # stringify ObjectId
        alerts.append(alert)

    return alerts


@router.get("/students")
async def get_students(risk: str | None = None):
	query = {}
	if risk:
		query["risk_level"] = risk

	students = []
	async for student in students_collection.find(query):
		student["_id"] = str(student["_id"])  # stringify ObjectId
		students.append(student)

	return students


@router.get("/all-students")
async def get_all_students():
    """
    Get all students with complete data including confidence scores and predictions.
    """
    students = []
    async for student in students_collection.find():
        student["_id"] = str(student["_id"])
        
        # Ensure all fields are present for frontend
        if "confidence_score" not in student and "risk_probability" in student:
            student["confidence_score"] = student["risk_probability"]
        
        if "average_marks" not in student:
            subjects = student.get("subjects", [])
            if subjects:
                student["average_marks"] = calculate_average_marks(subjects)
            else:
                student["average_marks"] = 0
        
        students.append(student)
    
    return students


@router.get("/student/{student_id}")
async def get_student(student_id: str):
    try:
        student = await students_collection.find_one({"_id": ObjectId(student_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid student id")

    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    student["_id"] = str(student["_id"])
    
    # MIGRATION: handle old students with "marks" field
    subjects = student.get("subjects", [])
    if not subjects and "marks" in student:
        subjects = [{"subject_name": "Overall", "marks": student["marks"]}]
    
    average_marks = student.get("average_marks")
    if average_marks is None:
        if subjects:
            average_marks = calculate_average_marks(subjects)
        elif "marks" in student:
            average_marks = student["marks"]
        else:
            average_marks = 0
    
    return {
        "_id": student.get("_id"),
        "name": student.get("name"),
        "attendance": student.get("attendance"),
        "behaviour": student.get("behaviour"),
        "fees_paid": student.get("fees_paid"),
        "subjects": subjects,
        "average_marks": average_marks,
        "risk_level": student.get("risk_level"),
        "predicted_label": student.get("predicted_label"),
        "confidence_score": student.get("confidence_score"),
        "probability": student.get("risk_probability", student.get("probability")),
    }


@router.get("/student-analytics/{student_id}")
async def get_student_analytics(student_id: str):
    """
    Get comprehensive analytics for a specific student.
    Returns all data needed for the analytics/detail page.
    """
    try:
        student = await students_collection.find_one({"_id": ObjectId(student_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid student id")

    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    student_name = student.get("name")
    subjects = student.get("subjects", [])
    average_marks = student.get("average_marks", 0)
    attendance = student.get("attendance", 0)
    behaviour = student.get("behaviour", 0)
    confidence_score = student.get("confidence_score", 0)
    predicted_label = student.get("predicted_label", "")
    
    # Generate AI observations based on metrics
    observations = []
    if attendance < 70:
        observations.append("Attendance is below optimal level")
    if average_marks < 65:
        observations.append("Academic performance needs improvement")
    if behaviour < 50:
        observations.append("Behaviour score is low")
    if not observations:
        observations.append("Student is performing well across all metrics")
    
    return {
        "student_id": str(student["_id"]),
        "student_name": student_name,
        "attendance": attendance,
        "behaviour": behaviour,
        "average_marks": average_marks,
        "subjects": subjects,
        "confidence_score": confidence_score,
        "predicted_label": predicted_label,
        "ai_observations": observations,
    }


@router.delete("/delete-student/{student_id}")
async def delete_student(student_id: str):
    """
    Delete student from ALL collections:
    - students collection
    - alerts collection
    - notes collection
    """
    try:
        # Get student info first
        student = await students_collection.find_one({"_id": ObjectId(student_id)})
        
        if not student:
            raise HTTPException(status_code=404, detail="Student not found")
        
        student_name = student.get("name")
        
        # Delete from students collection
        await students_collection.delete_one({"_id": ObjectId(student_id)})
        
        # Delete all alerts for this student
        await alerts_collection.delete_many({"student_id": student_id})
        
        # Delete all notes for this student
        await notes_collection.delete_many({"student_id": student_id})
        
        return {
            "message": f"Student {student_name} deleted from all collections",
            "student_id": student_id,
            "student_name": student_name
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Delete failed: {str(e)}")

@router.post("/upload-excel")
async def upload_excel(file: UploadFile = File(...)):
    """
    Upload Excel file with student data.
    Excel format: name, attendance, behaviour, fees_paid, subject, marks
    Multiple rows per student for different subjects.
    """
    try:
        # Read Excel file
        contents = await file.read()
        df = pd.read_excel(BytesIO(contents))

        # Validate required columns
        required_cols = ["name", "attendance", "behaviour", "fees_paid", "subject", "marks"]
        missing_cols = [col for col in required_cols if col not in df.columns]
        if missing_cols:
            raise HTTPException(
                status_code=400,
                detail=f"Missing required columns: {', '.join(missing_cols)}"
            )
        
        # Group by student name
        students_dict = {}
        
        for _, row in df.iterrows():
            name = str(row.get("name", "")).strip()
            if not name or pd.isna(name):
                continue
            
            if name not in students_dict:
                students_dict[name] = {
                    "name": name,
                    "attendance": float(row.get("attendance", 0)),
                    "behaviour": float(row.get("behaviour", 0)),
                    "fees_paid": str(row.get("fees_paid", "False")).strip().lower() in ["true", "yes", "1"],
                    "subjects": []
                }
            
            # Add subject
            subject_name = str(row.get("subject", "")).strip()
            try:
                subject_marks = float(row.get("marks", 0))
            except (ValueError, TypeError):
                subject_marks = 0.0
            
            if subject_name and not pd.isna(subject_name):
                students_dict[name]["subjects"].append({
                    "subject_name": subject_name,
                    "marks": subject_marks
                })
        
        if not students_dict:
            raise HTTPException(
                status_code=400,
                detail="No valid student data found in Excel file"
            )
        
        students_added = []
        students_updated = []
        errors = []
        
        for name, student_data in students_dict.items():
            try:
                # Validate subjects
                if not student_data["subjects"]:
                    errors.append(f"{name}: No valid subjects found")
                    continue
                
                # Extract subject marks for ML prediction
                subject_marks = [s["marks"] for s in student_data["subjects"]]
                
                # Use new ML predictor
                prediction = predict_student(
                    student_data["attendance"],
                    student_data["behaviour"],
                    subject_marks
                )
                
                predicted_label = prediction["predicted_label"]
                confidence_score = prediction["confidence_score"]
                average_marks = prediction["avg_marks"]
                risk_level = _map_label_to_risk_level(predicted_label)
                
                # Check if student already exists
                existing_student = await students_collection.find_one({"name": name})
                
                student_doc = {
                    "name": name,
                    "attendance": student_data["attendance"],
                    "behaviour": student_data["behaviour"],
                    "fees_paid": student_data["fees_paid"],
                    "subjects": student_data["subjects"],
                    "average_marks": average_marks,
                    "predicted_label": predicted_label,
                    "confidence_score": confidence_score,
                    "risk_level": risk_level,
                    "risk_probability": confidence_score,
                }
                
                if existing_student:
                    # Update existing student
                    await students_collection.update_one(
                        {"name": name},
                        {"$set": student_doc}
                    )
                    student_doc["_id"] = existing_student["_id"]
                    students_updated.append(name)
                else:
                    # Insert new student
                    insert_result = await students_collection.insert_one(student_doc)
                    student_doc["_id"] = insert_result.inserted_id
                    students_added.append(name)
                
                # Generate alerts
                await generate_alerts_for_student(
                    student_after=student_doc,
                    student_before=existing_student
                )
                
            except Exception as e:
                errors.append(f"{name}: {str(e)}")
                continue
        
        response = {
            "message": "Excel processed successfully",
            "students_added": len(students_added),
            "students_updated": len(students_updated),
            "total_processed": len(students_added) + len(students_updated),
            "added_names": students_added,
            "updated_names": students_updated,
        }
        
        if errors:
            response["errors"] = errors
        
        return response

    except HTTPException:
        raise
    except Exception as e:
        return {"error": str(e)}

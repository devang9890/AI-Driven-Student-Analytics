from fastapi import APIRouter, HTTPException
from bson import ObjectId
from datetime import datetime

from app.db import notes_collection

router = APIRouter(tags=["Notes"])


@router.post("/students/{student_id}/notes")
async def add_note(student_id: str, payload: dict):
    author = payload.get("author")
    content = payload.get("content")

    if not author or not content:
        raise HTTPException(status_code=400, detail="Author and content are required")

    note_doc = {
        "student_id": student_id,
        "author": author,
        "content": content,
        "created_at": datetime.utcnow()
    }

    result = await notes_collection.insert_one(note_doc)
    note_doc["_id"] = str(result.inserted_id)
    return note_doc


@router.get("/students/{student_id}/notes")
async def get_notes(student_id: str):
    notes = []
    cursor = notes_collection.find({"student_id": student_id}).sort("created_at", -1)
    async for note in cursor:
        note["_id"] = str(note["_id"])
        notes.append(note)
    return notes


@router.delete("/notes/{note_id}")
async def delete_note(note_id: str):
    try:
        oid = ObjectId(note_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid note id")

    result = await notes_collection.delete_one({"_id": oid})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Note not found")

    return {"message": "Note deleted"}

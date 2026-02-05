import os
from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = os.getenv("MONGO_DB", "student_risk")

_client = AsyncIOMotorClient(MONGO_URL)
_db = _client[DB_NAME]
db = _db  # export for routers to access collections

students_collection = _db["students"]
alerts_collection = _db["alerts"]
notes_collection = _db["notes"]

from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URL = "mongodb+srv://devang9890_db_user:ey1Ua4cDGB2Buan2@cluster0.zhkha6y.mongodb.net/?appName=Cluster0"

client = AsyncIOMotorClient(MONGO_URL)
db = client["student_risk_db"]

students_collection = db["students"]

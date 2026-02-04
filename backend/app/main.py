from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Database
from app.database import engine, Base


# Import ALL models so SQLAlchemy registers them before create_all
from app.models import (
    student,
    attendance,
    marks,
    lms_activity,
)

# Import routers
from app.routes import (
    student as student_routes,
    analytics as analytics_routes,
    prediction as prediction_routes,
)

# --------------------------------------------------
# FastAPI App
# --------------------------------------------------
app = FastAPI(
    title="AI Student Risk Analytics",
    version="1.0.0",
    description="Backend API for AI-driven student performance and risk analytics"
)

# --------------------------------------------------
# Create DB Tables
# --------------------------------------------------
Base.metadata.create_all(bind=engine)

# --------------------------------------------------
# Middleware (CORS for React)
# --------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # later restrict to frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------------------------------------------------
# Routers
# --------------------------------------------------
app.include_router(student_routes.router)
app.include_router(analytics_routes.router)
app.include_router(prediction_routes.router)


# --------------------------------------------------
# Root Health Check
# --------------------------------------------------
@app.get("/")
def root():
    return {
        "message": "AI-Driven Student Risk Analytics API is running 🚀"
    }

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(prefix="/admin", tags=["Admin"])

# hardcoded admin
ADMIN_EMAIL = "admin@gmail.com"
ADMIN_PASSWORD = "admin123"


class LoginRequest(BaseModel):
    email: str
    password: str


@router.post("/login")
def admin_login(data: LoginRequest):
    if data.email == ADMIN_EMAIL and data.password == ADMIN_PASSWORD:
        return {
            "status": "success",
            "message": "Login successful",
            "admin": {
                "email": ADMIN_EMAIL,
                "role": "admin",
            },
        }
    raise HTTPException(status_code=401, detail="Invalid credentials")

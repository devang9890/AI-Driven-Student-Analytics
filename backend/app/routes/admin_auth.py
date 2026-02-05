from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from datetime import datetime, timedelta
import os
import jwt

router = APIRouter(prefix="/admin", tags=["Admin"])

# hardcoded admin
ADMIN_EMAIL = "admin@gmail.com"
ADMIN_PASSWORD = "admin123"
JWT_SECRET = os.getenv("JWT_SECRET", "CHANGE_ME_SUPER_SECRET")
JWT_ALGORITHM = "HS256"
JWT_EXPIRE_HOURS = int(os.getenv("JWT_EXPIRE_HOURS", "8"))

auth_scheme = HTTPBearer()


class LoginRequest(BaseModel):
    email: str
    password: str


def create_access_token(payload: dict) -> str:
    expire = datetime.utcnow() + timedelta(hours=JWT_EXPIRE_HOURS)
    to_encode = {**payload, "exp": expire}
    return jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)


def get_current_admin(credentials: HTTPAuthorizationCredentials = Depends(auth_scheme)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        if payload.get("role") != "admin":
            raise HTTPException(status_code=401, detail="Unauthorized")
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")


@router.post("/login")
def admin_login(data: LoginRequest):
    if data.email == ADMIN_EMAIL and data.password == ADMIN_PASSWORD:
        token = create_access_token({"email": ADMIN_EMAIL, "role": "admin"})
        return {
            "status": "success",
            "message": "Login successful",
            "admin": {
                "email": ADMIN_EMAIL,
                "role": "admin",
            },
            "access_token": token,
            "token_type": "bearer",
        }
    raise HTTPException(status_code=401, detail="Invalid credentials")

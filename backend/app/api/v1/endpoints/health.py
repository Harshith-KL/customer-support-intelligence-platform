
from fastapi import APIRouter

router = APIRouter()


@router.get("/")
def health_check():
    return {
        "status": "healthy",
        "message": "Customer Support Intelligence Platform API is operational",
    }

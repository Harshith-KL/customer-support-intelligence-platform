from fastapi import APIRouter

from app.api.v1.endpoints import (
    ai_analysis,
    health,
    tickets,
)


api_router = APIRouter()

api_router.include_router(
    health.router,
    prefix="/health",
    tags=["Health"],
)

api_router.include_router(
    tickets.router,
    prefix="/tickets",
    tags=["Tickets"],
)

api_router.include_router(
    ai_analysis.router,
    tags=["AI Analysis"],
)

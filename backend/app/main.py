
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.api.v1.router import api_router


app = FastAPI(
    title=settings.app_name,
    description="AI-powered customer support ticket management platform",
    version="1.0.0",
    debug=settings.debug,
)

# Allow requests from the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        origin.strip()
        for origin in settings.cors_origins.split(",")
        if origin.strip()
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api/v1")

@app.get("/", tags=["Root"])
def root():
    return {
        "message": "Customer Support Intelligence Platform API",
        "status": "running",
    }

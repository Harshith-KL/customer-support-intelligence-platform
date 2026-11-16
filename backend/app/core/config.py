from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


BACKEND_DIR = Path(__file__).resolve().parents[2]


class Settings(BaseSettings):
    app_name: str = "Customer Support Intelligence Platform"
    app_env: str = "development"
    debug: bool = True

    database_url: str

    openai_api_key: str = ""
    openai_base_url: str = ""
    openai_model: str = ""

    cors_origins: str = "http://localhost:5173"

    model_config = SettingsConfigDict(
        env_file=BACKEND_DIR / ".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()

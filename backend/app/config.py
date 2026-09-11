# ============================================================================
# Application Configuration
# ============================================================================

from pydantic_settings import BaseSettings
import os
from datetime import timedelta

class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "postgresql://neondb_owner:npg_XhQ8NQboVC7H@ep-muddy-mountain-a5q3rcye-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require"
    )
    
    # JWT
    SECRET_KEY: str = os.getenv("SECRET_KEY", "9f86d081884c7d659a2feaa0c55ad015")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # URLs
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:3000")
    BACKEND_URL: str = os.getenv("BACKEND_URL", "https://event-ai-backend-o2f3.onrender.com")
    
    # Email
    SMTP_SERVER: str = os.getenv("SMTP_SERVER", "smtp.gmail.com")
    SMTP_PORT: int = int(os.getenv("SMTP_PORT", "587"))
    SMTP_USER: str = os.getenv("SMTP_USER", "")
    SMTP_PASSWORD: str = os.getenv("SMTP_PASSWORD", "")
    
    # App
    APP_NAME: str = "EventAI"
    APP_VERSION: str = "1.0.0"
    
    class Config:
        env_file = ".env"
        case_sensitive = False

settings = Settings()
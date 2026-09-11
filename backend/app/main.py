# ============================================================================
# Main FastAPI Application
# ============================================================================

import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.database import init_db
from app.config import settings

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ============================================================================
# LIFESPAN EVENT
# ============================================================================

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("🚀 Starting EventAI Backend...")
    init_db()
    logger.info("✅ Database ready")
    yield
    # Shutdown
    logger.info("👋 Shutting down EventAI Backend...")

# ============================================================================
# FASTAPI APP
# ============================================================================

app = FastAPI(
    title="EventAI API",
    description="Enterprise Event Management Platform",
    version="1.0.0",
    lifespan=lifespan
)

# ============================================================================
# CORS MIDDLEWARE (MUST BE FIRST)
# ============================================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
        "https://frontend-livid-two-96gqet7oy4.vercel.app",
        "https://event-ai-psi.vercel.app",
        "*"  # For development only
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=600
)

# ============================================================================
# IMPORT ROUTERS (AFTER MIDDLEWARE)
# ============================================================================

from app.routes import (
    auth, users, sessions, speakers, resources, ratings,
    announcements, social, badges, challenges, learning_paths, partners
)

# ============================================================================
# INCLUDE ROUTERS
# ============================================================================

app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(users.router, prefix="/api/v1/users", tags=["users"])
app.include_router(sessions.router, prefix="/api/v1/sessions", tags=["sessions"])
app.include_router(speakers.router, prefix="/api/v1/speakers", tags=["speakers"])
app.include_router(resources.router, prefix="/api/v1/resources", tags=["resources"])
app.include_router(ratings.router, prefix="/api/v1/ratings", tags=["ratings"])
app.include_router(announcements.router, prefix="/api/v1/announcements", tags=["announcements"])
app.include_router(social.router, prefix="/api/v1/social", tags=["social"])
app.include_router(badges.router, prefix="/api/v1/badges", tags=["badges"])
app.include_router(challenges.router, prefix="/api/v1/challenges", tags=["challenges"])
app.include_router(learning_paths.router, prefix="/api/v1/learning-paths", tags=["learning_paths"])
app.include_router(partners.router, prefix="/api/v1/partners", tags=["partners"])

# ============================================================================
# HEALTH CHECK
# ============================================================================

@app.get("/")
async def root():
    return {
        "message": "✅ EventAI API is running",
        "version": "1.0.0",
        "status": "active"
    }

@app.get("/api/v1/health")
async def health_check():
    return {
        "status": "healthy",
        "api": "EventAI v1.0.0"
    }

# ============================================================================
# INFO
# ============================================================================

logger.info("✅ EventAI Backend initialized")
logger.info(f"📍 Running on: {settings.DATABASE_URL[:50]}...")
logger.info(f"🔐 CORS enabled for: {len(app.user_middleware)} origins")
# ============================================================================
# Database Configuration
# ============================================================================

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.config import settings
from app.models import Base
import logging

logger = logging.getLogger(__name__)

# ✅ Database URL from environment
DATABASE_URL = settings.DATABASE_URL

# ✅ Create engine with proper config
engine = create_engine(
    DATABASE_URL,
    echo=False,
    pool_pre_ping=True,
    pool_recycle=3600,
    connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {}
)

# ✅ Create session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# ✅ Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ✅ Create tables on startup
def init_db():
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("✅ Database tables created successfully")
    except Exception as e:
        logger.error(f"❌ Database initialization error: {e}")
        raise
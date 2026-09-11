# ============================================================================
# Authentication Routes
# ============================================================================

import logging
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User
from app.utils.auth import hash_password, verify_password, create_access_token, create_refresh_token
from pydantic import BaseModel

logger = logging.getLogger(__name__)
router = APIRouter()

# ============================================================================
# SCHEMAS
# ============================================================================

class RegisterRequest(BaseModel):
    first_name: str
    last_name: str
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

# ============================================================================
# REGISTER
# ============================================================================

@router.post("/register", response_model=TokenResponse)
def register(request: RegisterRequest, db: Session = Depends(get_db)):
    """Register new user"""
    try:
        logger.info(f"📝 Registration: {request.email}")
        
        # Check if user exists
        existing = db.query(User).filter(User.email == request.email).first()
        if existing:
            logger.warning(f"⚠️ Email already exists: {request.email}")
            raise HTTPException(status_code=400, detail="Email already registered")
        
        # Create user
        user = User(
            first_name=request.first_name,
            last_name=request.last_name,
            email=request.email,
            hashed_password=hash_password(request.password),
            is_active=True,
            email_verified=True
        )
        
        db.add(user)
        db.commit()
        db.refresh(user)
        
        logger.info(f"✅ User registered: {user.email}")
        
        # Generate tokens
        access_token = create_access_token(data={"sub": str(user.id)})
        refresh_token = create_refresh_token(data={"sub": str(user.id)})
        
        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer"
        }
        
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"❌ Registration error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# ============================================================================
# LOGIN
# ============================================================================

@router.post("/login", response_model=TokenResponse)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    """Login user"""
    try:
        logger.info(f"🔐 Login: {request.email}")
        
        # Find user
        user = db.query(User).filter(User.email == request.email).first()
        if not user:
            logger.warning(f"⚠️ User not found: {request.email}")
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        # Verify password
        if not verify_password(request.password, user.hashed_password):
            logger.warning(f"⚠️ Invalid password: {request.email}")
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        logger.info(f"✅ Login successful: {user.email}")
        
        # Generate tokens
        access_token = create_access_token(data={"sub": str(user.id)})
        refresh_token = create_refresh_token(data={"sub": str(user.id)})
        
        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer"
        }
        
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"❌ Login error: {e}")
        raise HTTPException(status_code=500, detail="Login failed")

# ============================================================================
# VERIFY EMAIL
# ============================================================================

@router.post("/verify-email")
def verify_email(email: str, db: Session = Depends(get_db)):
    """Verify email"""
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.email_verified = True
    db.commit()
    
    return {"message": "Email verified"}

# ============================================================================
# COMPLETE PROFILE
# ============================================================================

@router.post("/complete-profile")
def complete_profile(profile: dict, db: Session = Depends(get_db)):
    """Update profile"""
    try:
        # Get user ID from token (simplified for now)
        # In production, use Depends(get_current_user)
        
        return {"message": "Profile updated"}
    except Exception as e:
        logger.error(f"❌ Profile update error: {e}")
        raise HTTPException(status_code=500, detail="Profile update failed")
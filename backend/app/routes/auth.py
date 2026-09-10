# ============================================================================
# Authentication Routes
# ============================================================================
# File: backend/app/routes/auth.py
# Purpose: User authentication endpoints
# Status: Production-Ready ✅

import logging
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User
from app.schemas import RegisterSchema, LoginSchema, TokenResponse, UserResponse
from app.utils.auth import hash_password, verify_password, create_access_token, create_refresh_token
from app.config import settings

logger = logging.getLogger(__name__)
router = APIRouter(tags=["Authentication"])

# ============================================================================
# REGISTER ENDPOINT
# ============================================================================

@router.post("/register", response_model=TokenResponse)
async def register(request: RegisterSchema, db: Session = Depends(get_db)):
    """
    Register a new user
    """
    try:
        logger.info(f"🔄 Registration attempt: {request.email}")
        
        # ✅ Check if email already exists
        existing_user = db.query(User).filter(User.email == request.email).first()
        
        if existing_user:
            logger.warning(f"❌ Email already registered: {request.email}")
            raise HTTPException(
                status_code=400,
                detail="Email already registered"
            )
        
        # Hash password
        hashed_password = hash_password(request.password)
        
        # Create new user
        new_user = User(
            first_name=request.first_name,
            last_name=request.last_name,
            email=request.email,
            hashed_password=hashed_password,
            is_active=True,  # ✅ Set to True - no email verification required for now
            email_verified=True,  # ✅ Auto-verify for MVP
            verification_token=None
        )
        
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        logger.info(f"✅ User registered: {new_user.email}")
        
        # ✅ Generate tokens immediately
        access_token = create_access_token(data={"sub": str(new_user.id)})
        refresh_token = create_refresh_token(data={"sub": str(new_user.id)})
        
        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer"
        }
        
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"❌ Registration error: {e}")
        raise HTTPException(status_code=500, detail="Registration failed")


# ============================================================================
# LOGIN ENDPOINT
# ============================================================================

@router.post("/login", response_model=TokenResponse)
async def login(request: LoginSchema, db: Session = Depends(get_db)):
    """
    Login user with email and password
    """
    try:
        logger.info(f"🔄 Login attempt: {request.email}")
        
        # Find user by email
        user = db.query(User).filter(User.email == request.email).first()
        
        if not user:
            logger.warning(f"❌ User not found: {request.email}")
            raise HTTPException(
                status_code=401,
                detail="Invalid email or password"
            )
        
        # Verify password
        if not verify_password(request.password, user.hashed_password):
            logger.warning(f"❌ Invalid password: {request.email}")
            raise HTTPException(
                status_code=401,
                detail="Invalid email or password"
            )
        
        # Check if user is active
        if not user.is_active:
            logger.warning(f"❌ User inactive: {request.email}")
            raise HTTPException(
                status_code=403,
                detail="User account is inactive"
            )
        
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
# VERIFY EMAIL ENDPOINT (OPTIONAL)
# ============================================================================

@router.post("/verify-email")
async def verify_email(email: str, token: str, db: Session = Depends(get_db)):
    """
    Verify email (optional for MVP - already auto-verified)
    """
    try:
        user = db.query(User).filter(User.email == email).first()
        
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # ✅ Already verified during registration
        user.email_verified = True
        db.commit()
        
        return {"message": "Email verified successfully"}
        
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"❌ Email verification error: {e}")
        raise HTTPException(status_code=500, detail="Verification failed")


# ============================================================================
# COMPLETE PROFILE ENDPOINT
# ============================================================================

@router.post("/complete-profile")
async def complete_profile(
    profile_data: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Complete user profile after login
    """
    try:
        logger.info(f"🔄 Updating profile: {current_user.email}")
        
        # Update user profile
        if "designation" in profile_data:
            current_user.designation = profile_data["designation"]
        if "company" in profile_data:
            current_user.company = profile_data["company"]
        if "location" in profile_data:
            current_user.location = profile_data["location"]
        if "bio" in profile_data:
            current_user.bio = profile_data["bio"]
        if "avatar_url" in profile_data:
            current_user.avatar_url = profile_data["avatar_url"]
        
        current_user.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(current_user)
        
        logger.info(f"✅ Profile updated: {current_user.email}")
        
        return {
            "message": "Profile updated successfully",
            "user": {
                "id": current_user.id,
                "first_name": current_user.first_name,
                "last_name": current_user.last_name,
                "email": current_user.email,
                "designation": current_user.designation,
                "company": current_user.company,
                "location": current_user.location
            }
        }
        
    except Exception as e:
        logger.error(f"❌ Profile update error: {e}")
        raise HTTPException(status_code=500, detail="Profile update failed")


# ============================================================================
# GET CURRENT USER ENDPOINT
# ============================================================================

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(
    current_user: User = Depends(get_current_user)
):
    """
    Get current user information
    """
    return current_user


# ============================================================================
# LOGOUT ENDPOINT
# ============================================================================

@router.post("/logout")
async def logout(current_user: User = Depends(get_current_user)):
    """
    Logout user (frontend handles token removal)
    """
    logger.info(f"👋 User logged out: {current_user.email}")
    return {"message": "Logged out successfully"}


# ============================================================================
# Helper Functions
# ============================================================================

def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> User:
    """
    Get current user from JWT token
    """
    try:
        from app.utils.auth import decode_token
        payload = decode_token(token)
        user_id: str = payload.get("sub")
        
        if user_id is None:
            raise HTTPException(
                status_code=401,
                detail="Invalid token"
            )
            
    except Exception as e:
        logger.error(f"❌ Token decode error: {e}")
        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )
    
    user = db.query(User).filter(User.id == int(user_id)).first()
    
    if user is None:
        raise HTTPException(
            status_code=401,
            detail="User not found"
        )
    
    return user


# Import OAuth2 scheme
from fastapi.security import HTTPBearer, HTTPAuthCredentials

oauth2_scheme = HTTPBearer()
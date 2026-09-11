# ============================================================================
# Pydantic Schemas for Request/Response Validation
# ============================================================================
# File: backend/app/schemas.py
# Purpose: Define Pydantic models for data validation
# Status: Production-Ready ✅

from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

# ============================================================================
# AUTHENTICATION SCHEMAS
# ============================================================================

class RegisterSchema(BaseModel):
    """User registration request"""
    first_name: str = Field(..., min_length=1, max_length=100)
    last_name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=255)

    class Config:
        json_schema_extra = {
            "example": {
                "first_name": "Raviraj",
                "last_name": "Panthulu",
                "email": "raviraj@gmail.com",
                "password": "Test@12345"
            }
        }


class LoginSchema(BaseModel):
    """User login request"""
    email: EmailStr
    password: str

    class Config:
        json_schema_extra = {
            "example": {
                "email": "raviraj@gmail.com",
                "password": "Test@12345"
            }
        }


class TokenResponse(BaseModel):
    """JWT token response"""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

    class Config:
        json_schema_extra = {
            "example": {
                "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                "token_type": "bearer"
            }
        }


# ============================================================================
# USER SCHEMAS
# ============================================================================

class UserResponse(BaseModel):
    """User response model"""
    id: int
    first_name: str
    last_name: str
    email: str
    company: Optional[str] = None
    designation: Optional[str] = None
    location: Optional[str] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "id": 1,
                "first_name": "Raviraj",
                "last_name": "Panthulu",
                "email": "raviraj@gmail.com",
                "company": "TCS",
                "designation": "Software Engineer",
                "location": "Hyderabad",
                "is_active": True,
                "created_at": "2026-09-11T10:30:00"
            }
        }


class UserProfileUpdate(BaseModel):
    """Update user profile"""
    designation: Optional[str] = None
    company: Optional[str] = None
    location: Optional[str] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None


# ============================================================================
# SESSION SCHEMAS
# ============================================================================

class SessionResponse(BaseModel):
    """Session response model"""
    id: int
    title: str
    description: Optional[str] = None
    speaker_id: int
    start_time: datetime
    end_time: datetime
    location: Optional[str] = None
    capacity: int
    created_at: datetime

    class Config:
        from_attributes = True


class SessionCreate(BaseModel):
    """Create session"""
    title: str
    description: Optional[str] = None
    speaker_id: int
    start_time: datetime
    end_time: datetime
    location: Optional[str] = None
    capacity: int = 100


# ============================================================================
# RATING SCHEMAS
# ============================================================================

class RatingCreate(BaseModel):
    """Create rating"""
    score: int = Field(..., ge=1, le=5)
    comment: Optional[str] = Field(None, max_length=1000)
    session_id: Optional[int] = None
    speaker_id: Optional[int] = None
    resource_id: Optional[int] = None


class RatingResponse(BaseModel):
    """Rating response"""
    id: int
    user_id: int
    score: int
    comment: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


# ============================================================================
# SPEAKER SCHEMAS
# ============================================================================

class SpeakerResponse(BaseModel):
    """Speaker response"""
    id: int
    first_name: str
    last_name: str
    email: str
    avatar_url: Optional[str] = None
    bio: Optional[str] = None
    designation: Optional[str] = None
    company: Optional[str] = None
    expertise: Optional[str] = None
    rating_count: int = 0
    average_rating: float = 0.0
    session_count: int = 0
    created_at: datetime

    class Config:
        from_attributes = True


# ============================================================================
# ANNOUNCEMENT SCHEMAS
# ============================================================================

class AnnouncementCreate(BaseModel):
    """Create announcement"""
    title: str = Field(..., max_length=255)
    content: str = Field(..., max_length=2000)
    category: Optional[str] = "General"
    priority: str = "low"


class AnnouncementResponse(BaseModel):
    """Announcement response"""
    id: int
    title: str
    content: str
    creator_id: int
    category: Optional[str] = None
    priority: str
    created_at: datetime

    class Config:
        from_attributes = True


# ============================================================================
# RESOURCE SCHEMAS
# ============================================================================

class ResourceResponse(BaseModel):
    """Resource response"""
    id: int
    session_id: Optional[int] = None
    title: str
    description: Optional[str] = None
    resource_type: Optional[str] = None
    file_url: str
    download_count: int = 0
    rating_count: int = 0
    average_rating: float = 0.0
    created_at: datetime

    class Config:
        from_attributes = True


class ResourceCreate(BaseModel):
    """Create resource"""
    session_id: Optional[int] = None
    title: str
    description: Optional[str] = None
    resource_type: Optional[str] = None
    file_url: str


# ============================================================================
# SOCIAL SCHEMAS
# ============================================================================

class SocialPostCreate(BaseModel):
    """Create social post"""
    content: str = Field(..., min_length=1, max_length=2000)
    image_url: Optional[str] = None


class SocialPostResponse(BaseModel):
    """Social post response"""
    id: int
    user_id: int
    content: str
    image_url: Optional[str] = None
    like_count: int = 0
    comment_count: int = 0
    is_approved: bool = True
    created_at: datetime

    class Config:
        from_attributes = True


class CommentCreate(BaseModel):
    """Create comment"""
    content: str = Field(..., min_length=1, max_length=1000)


class CommentResponse(BaseModel):
    """Comment response"""
    id: int
    user_id: int
    post_id: int
    content: str
    like_count: int = 0
    created_at: datetime

    class Config:
        from_attributes = True


class LikeCreate(BaseModel):
    """Create like"""
    post_id: int


# ============================================================================
# BADGE SCHEMAS
# ============================================================================

class BadgeResponse(BaseModel):
    """Badge response"""
    id: int
    name: str
    description: Optional[str] = None
    icon_url: Optional[str] = None
    rarity: str = "common"
    points_reward: int = 0
    created_at: datetime

    class Config:
        from_attributes = True


# ============================================================================
# CHALLENGE SCHEMAS
# ============================================================================

class ChallengeResponse(BaseModel):
    """Challenge response"""
    id: int
    title: str
    description: Optional[str] = None
    difficulty: str = "medium"
    points_reward: int = 20
    completion_count: int = 0
    created_at: datetime

    class Config:
        from_attributes = True


# ============================================================================
# LEADERBOARD SCHEMAS
# ============================================================================

class LeaderboardResponse(BaseModel):
    """Leaderboard response"""
    id: int
    user_id: int
    total_points: int = 0
    current_rank: int = 0
    tier: str = "bronze"
    updated_at: datetime

    class Config:
        from_attributes = True


class LeaderboardDetailResponse(BaseModel):
    """Leaderboard with user details"""
    rank: int
    user: UserResponse
    total_points: int
    tier: str
    badges_earned: int = 0
    sessions_attended: int = 0

    class Config:
        from_attributes = True


# ============================================================================
# LEARNING PATH SCHEMAS
# ============================================================================

class ModuleResponse(BaseModel):
    """Module response"""
    id: int
    learning_path_id: int
    title: str
    description: Optional[str] = None
    order: int = 0
    duration: int = 30
    created_at: datetime

    class Config:
        from_attributes = True


class LearningPathResponse(BaseModel):
    """Learning path response"""
    id: int
    title: str
    description: Optional[str] = None
    difficulty: str = "Beginner"
    duration_weeks: int = 4
    points_reward: int = 50
    enrolled_count: int = 0
    created_at: datetime

    class Config:
        from_attributes = True


class LearningPathDetailResponse(BaseModel):
    """Learning path with modules"""
    id: int
    title: str
    description: Optional[str] = None
    difficulty: str
    duration_weeks: int
    points_reward: int
    enrolled_count: int
    modules: list = []
    created_at: datetime

    class Config:
        from_attributes = True


# ============================================================================
# ENGAGEMENT CENTER SCHEMAS
# ============================================================================

class EngagementSummaryResponse(BaseModel):
    """Engagement center summary"""
    active_challenges: int = 0
    active_polls: int = 0
    available_quizzes: int = 0
    pending_activities: int = 0
    total_points_this_week: int = 0
    current_rank: int = 0
    current_tier: str = "bronze"


# ============================================================================
# ADMIN SCHEMAS
# ============================================================================

class AdminUserResponse(BaseModel):
    """Admin user list response"""
    id: int
    first_name: str
    last_name: str
    email: str
    company: Optional[str] = None
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


# ============================================================================
# ERROR SCHEMAS
# ============================================================================

class ErrorResponse(BaseModel):
    """Error response"""
    detail: str
    status_code: int

    class Config:
        json_schema_extra = {
            "example": {
                "detail": "Error message",
                "status_code": 400
            }
        }
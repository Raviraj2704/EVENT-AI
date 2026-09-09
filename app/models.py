# ============================================================================
# Database Models
# ============================================================================
# File: backend/app/models.py
# Purpose: SQLAlchemy ORM models for EventAI database
# Status: Production-Ready ✅

from sqlalchemy import Column, Integer, String, Boolean, DateTime, Float, Text, ForeignKey, Table
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

# ============================================================================
# Association Tables (Many-to-Many)
# ============================================================================

# Session-Speaker Association
session_speakers = Table(
    'session_speakers',
    Base.metadata,
    Column('session_id', Integer, ForeignKey('sessions.id'), primary_key=True),
    Column('speaker_id', Integer, ForeignKey('speakers.id'), primary_key=True)
)

# Session-Attendees Association
session_attendance = Table(
    'session_attendance',
    Base.metadata,
    Column('session_id', Integer, ForeignKey('sessions.id'), primary_key=True),
    Column('user_id', Integer, ForeignKey('users.id'), primary_key=True)
)

# ============================================================================
# USER MODEL
# ============================================================================

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    avatar_url = Column(String(500), nullable=True)
    bio = Column(String(500), nullable=True)
    designation = Column(String(100), nullable=True)
    company = Column(String(100), nullable=True)
    location = Column(String(100), nullable=True)
    is_active = Column(Boolean, default=False)
    is_admin = Column(Boolean, default=False)
    verification_token = Column(String(255), nullable=True)
    email_verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    ratings = relationship("Rating", back_populates="user", cascade="all, delete-orphan")
    posts = relationship("SocialPost", back_populates="user", cascade="all, delete-orphan")
    comments = relationship("Comment", back_populates="user", cascade="all, delete-orphan")
    likes = relationship("Like", back_populates="user", cascade="all, delete-orphan")
    badges = relationship("Badge", back_populates="users", secondary="user_badges")
    challenges = relationship("Challenge", back_populates="users", secondary="user_challenges")
    learning_paths = relationship("LearningPath", back_populates="users", secondary="user_learning_paths")
    announcements = relationship("Announcement", back_populates="creator")
    leaderboard_entries = relationship("Leaderboard", back_populates="user", cascade="all, delete-orphan")

# ============================================================================
# SPEAKER MODEL
# ============================================================================

class Speaker(Base):
    __tablename__ = "speakers"
    
    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    avatar_url = Column(String(500), nullable=True)
    bio = Column(String(1000), nullable=True)
    designation = Column(String(100), nullable=True)
    company = Column(String(100), nullable=True)
    expertise = Column(String(500), nullable=True)  # Comma-separated
    rating_count = Column(Integer, default=0)
    average_rating = Column(Float, default=0.0)
    session_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    sessions = relationship("Session", secondary=session_speakers, back_populates="speakers")
    ratings = relationship("Rating", back_populates="speaker", cascade="all, delete-orphan")

# ============================================================================
# SESSION MODEL
# ============================================================================

class Session(Base):
    __tablename__ = "sessions"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(String(2000), nullable=True)
    session_type = Column(String(50), nullable=True)  # Keynote, Workshop, Panel, etc.
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime, nullable=False)
    location = Column(String(255), nullable=True)
    capacity = Column(Integer, default=100)
    rating_count = Column(Integer, default=0)
    average_rating = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    speakers = relationship("Speaker", secondary=session_speakers, back_populates="sessions")
    attendees = relationship("User", secondary=session_attendance)
    ratings = relationship("Rating", back_populates="session", cascade="all, delete-orphan")
    resources = relationship("Resource", back_populates="session", cascade="all, delete-orphan")

# ============================================================================
# RESOURCE MODEL
# ============================================================================

class Resource(Base):
    __tablename__ = "resources"
    
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("sessions.id"), nullable=True)
    title = Column(String(255), nullable=False)
    description = Column(String(1000), nullable=True)
    resource_type = Column(String(50), nullable=True)  # PDF, Video, Document, etc.
    file_url = Column(String(500), nullable=False)
    download_count = Column(Integer, default=0)
    rating_count = Column(Integer, default=0)
    average_rating = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    session = relationship("Session", back_populates="resources")
    ratings = relationship("Rating", back_populates="resource", cascade="all, delete-orphan")

# ============================================================================
# RATING MODEL (FIXED - NO learning_path)
# ============================================================================

class Rating(Base):
    __tablename__ = "ratings"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    session_id = Column(Integer, ForeignKey("sessions.id"), nullable=True)
    speaker_id = Column(Integer, ForeignKey("speakers.id"), nullable=True)
    resource_id = Column(Integer, ForeignKey("resources.id"), nullable=True)
    score = Column(Integer, nullable=False)  # 1-5 stars
    comment = Column(String(1000), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="ratings")
    session = relationship("Session", back_populates="ratings")
    speaker = relationship("Speaker", back_populates="ratings")
    resource = relationship("Resource", back_populates="ratings")

# ============================================================================
# ANNOUNCEMENT MODEL
# ============================================================================

class Announcement(Base):
    __tablename__ = "announcements"
    
    id = Column(Integer, primary_key=True, index=True)
    creator_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(255), nullable=False)
    content = Column(String(2000), nullable=False)
    category = Column(String(50), nullable=True)  # Event, Schedule, General, Urgent
    priority = Column(String(50), default="low")  # high, medium, low
    action_url = Column(String(500), nullable=True)
    is_published = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    creator = relationship("User", back_populates="announcements")

# ============================================================================
# SOCIAL POST MODEL
# ============================================================================

class SocialPost(Base):
    __tablename__ = "social_posts"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    content = Column(String(2000), nullable=False)
    image_url = Column(String(500), nullable=True)
    like_count = Column(Integer, default=0)
    comment_count = Column(Integer, default=0)
    is_approved = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="posts")
    comments = relationship("Comment", back_populates="post", cascade="all, delete-orphan")
    likes = relationship("Like", back_populates="post", cascade="all, delete-orphan")

# ============================================================================
# COMMENT MODEL
# ============================================================================

class Comment(Base):
    __tablename__ = "comments"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    post_id = Column(Integer, ForeignKey("social_posts.id"), nullable=False)
    content = Column(String(500), nullable=False)
    like_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="comments")
    post = relationship("SocialPost", back_populates="comments")

# ============================================================================
# LIKE MODEL
# ============================================================================

class Like(Base):
    __tablename__ = "likes"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    post_id = Column(Integer, ForeignKey("social_posts.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="likes")
    post = relationship("SocialPost", back_populates="likes")

# ============================================================================
# LEADERBOARD MODEL
# ============================================================================

class Leaderboard(Base):
    __tablename__ = "leaderboard"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    total_points = Column(Integer, default=0)
    current_rank = Column(Integer, default=0)
    tier = Column(String(50), default="bronze")  # bronze, silver, gold, platinum
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="leaderboard_entries")

# ============================================================================
# BADGE MODEL
# ============================================================================

class Badge(Base):
    __tablename__ = "badges"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    description = Column(String(500), nullable=True)
    icon_url = Column(String(500), nullable=True)
    rarity = Column(String(50), default="common")  # common, uncommon, rare, epic, legendary
    points_reward = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    users = relationship("User", back_populates="badges", secondary="user_badges")

# ============================================================================
# BADGE-USER ASSOCIATION TABLE
# ============================================================================

user_badges = Table(
    'user_badges',
    Base.metadata,
    Column('user_id', Integer, ForeignKey('users.id'), primary_key=True),
    Column('badge_id', Integer, ForeignKey('badges.id'), primary_key=True)
)

# ============================================================================
# CHALLENGE MODEL
# ============================================================================

class Challenge(Base):
    __tablename__ = "challenges"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(String(2000), nullable=True)
    difficulty = Column(String(50), default="medium")  # easy, medium, hard
    points_reward = Column(Integer, default=20)
    completion_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    users = relationship("User", back_populates="challenges", secondary="user_challenges")

# ============================================================================
# CHALLENGE-USER ASSOCIATION TABLE
# ============================================================================

user_challenges = Table(
    'user_challenges',
    Base.metadata,
    Column('user_id', Integer, ForeignKey('users.id'), primary_key=True),
    Column('challenge_id', Integer, ForeignKey('challenges.id'), primary_key=True)
)

# ============================================================================
# LEARNING PATH MODEL (FIXED - NO ratings)
# ============================================================================

class LearningPath(Base):
    __tablename__ = "learning_paths"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(String(2000), nullable=True)
    difficulty = Column(String(50), default="Beginner")
    duration_weeks = Column(Integer, default=4)
    points_reward = Column(Integer, default=50)
    enrolled_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    modules = relationship("Module", back_populates="learning_path", cascade="all, delete-orphan")
    users = relationship("User", back_populates="learning_paths", secondary="user_learning_paths")

# ============================================================================
# LEARNING PATH-USER ASSOCIATION TABLE
# ============================================================================

user_learning_paths = Table(
    'user_learning_paths',
    Base.metadata,
    Column('user_id', Integer, ForeignKey('users.id'), primary_key=True),
    Column('learning_path_id', Integer, ForeignKey('learning_paths.id'), primary_key=True)
)

# ============================================================================
# MODULE MODEL
# ============================================================================

class Module(Base):
    __tablename__ = "modules"
    
    id = Column(Integer, primary_key=True, index=True)
    learning_path_id = Column(Integer, ForeignKey("learning_paths.id"), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(String(1000), nullable=True)
    order = Column(Integer, default=0)
    duration = Column(Integer, default=30)  # minutes
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    learning_path = relationship("LearningPath", back_populates="modules")

# ============================================================================
# ENGAGEMENT - POLL MODEL
# ============================================================================

class Poll(Base):
    __tablename__ = "polls"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(500), nullable=False)
    description = Column(String(1000), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime, nullable=True)
    
    # Relationships
    options = relationship("PollOption", back_populates="poll", cascade="all, delete-orphan")

# ============================================================================
# POLL OPTION MODEL
# ============================================================================

class PollOption(Base):
    __tablename__ = "poll_options"
    
    id = Column(Integer, primary_key=True, index=True)
    poll_id = Column(Integer, ForeignKey("polls.id"), nullable=False)
    text = Column(String(500), nullable=False)
    vote_count = Column(Integer, default=0)
    
    # Relationships
    poll = relationship("Poll", back_populates="options")

# ============================================================================
# QUIZ MODEL
# ============================================================================

class Quiz(Base):
    __tablename__ = "quizzes"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(String(1000), nullable=True)
    difficulty = Column(String(50), default="medium")
    time_limit_minutes = Column(Integer, default=30)
    points_reward = Column(Integer, default=20)
    passing_score = Column(Integer, default=70)
    question_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    questions = relationship("Question", back_populates="quiz", cascade="all, delete-orphan")

# ============================================================================
# QUESTION MODEL
# ============================================================================

class Question(Base):
    __tablename__ = "questions"
    
    id = Column(Integer, primary_key=True, index=True)
    quiz_id = Column(Integer, ForeignKey("quizzes.id"), nullable=False)
    text = Column(String(1000), nullable=False)
    question_type = Column(String(50), default="multiple_choice")
    options = Column(String(2000), nullable=True)  # JSON string
    correct_answer = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    quiz = relationship("Quiz", back_populates="questions")

# ============================================================================
# ACTIVITY MODEL
# ============================================================================

class Activity(Base):
    __tablename__ = "activities"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(String(1000), nullable=True)
    priority = Column(String(50), default="medium")  # high, medium, low
    deadline = Column(DateTime, nullable=True)
    points_reward = Column(Integer, default=10)
    completion_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships (No direct user relationship - tracked via user_activities)

# ============================================================================
# PARTNER MODEL
# ============================================================================

class Partner(Base):
    __tablename__ = "partners"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(String(1000), nullable=True)
    logo_url = Column(String(500), nullable=True)
    website = Column(String(500), nullable=True)
    category = Column(String(100), nullable=True)  # Technology, Finance, etc.
    tier = Column(String(50), default="bronze")  # platinum, gold, silver, bronze
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships

# ============================================================================
# END OF MODELS
# ============================================================================
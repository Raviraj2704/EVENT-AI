from fastapi import FastAPI, Depends, HTTPException, Query, WebSocket, WebSocketDisconnect, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, DateTime, Text, Boolean, ForeignKey, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime, timedelta
from pydantic import BaseModel
from typing import List, Optional, Dict
from passlib.context import CryptContext
from jose import JWTError, jwt
import json
import asyncio
from dotenv import load_dotenv
import os

# Load environment
load_dotenv()

# ============= DATABASE SETUP =============
DATABASE_URL = "sqlite:///./eventai.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()

# ============= DATABASE MODELS =============

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    email = Column(String, unique=True)
    name = Column(String)
    password_hash = Column(String)
    company = Column(String)
    job_title = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

class Event(Base):
    __tablename__ = "events"
    id = Column(Integer, primary_key=True)
    name = Column(String)
    description = Column(Text)
    date = Column(DateTime)
    location = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

class Session(Base):
    __tablename__ = "sessions"
    id = Column(Integer, primary_key=True)
    event_id = Column(Integer)
    title = Column(String)
    description = Column(Text)
    speaker_name = Column(String)
    start_time = Column(DateTime)
    end_time = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)

class UserProfile(Base):
    __tablename__ = "user_profiles"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer)
    full_name = Column(String)
    email = Column(String, unique=True)
    headline = Column(String)
    bio = Column(Text)
    company = Column(String)
    job_title = Column(String)
    location = Column(String)
    profile_photo_url = Column(String)
    interests = Column(JSON)
    skills = Column(JSON)
    looking_for = Column(Text)
    profile_completion_score = Column(Integer, default=0)
    is_verified = Column(Boolean, default=False)
    event_id = Column(Integer)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)

class Connection(Base):
    __tablename__ = "connections"
    id = Column(Integer, primary_key=True)
    requester_id = Column(Integer)
    recipient_id = Column(Integer)
    event_id = Column(Integer)
    status = Column(String, default="pending")
    custom_message = Column(Text)
    sent_at = Column(DateTime, default=datetime.utcnow)
    responded_at = Column(DateTime)
    is_mutual = Column(Boolean, default=False)
    connected_at = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)

class Conversation(Base):
    __tablename__ = "conversations"
    id = Column(Integer, primary_key=True)
    event_id = Column(Integer)
    participant_1_id = Column(Integer)
    participant_2_id = Column(Integer)
    last_message = Column(Text)
    last_message_at = Column(DateTime)
    unread_count_p1 = Column(Integer, default=0)
    unread_count_p2 = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    is_archived = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)

class Message(Base):
    __tablename__ = "messages"
    id = Column(Integer, primary_key=True)
    conversation_id = Column(Integer)
    sender_id = Column(Integer)
    content = Column(Text)
    message_type = Column(String, default="text")
    attachment_url = Column(String)
    is_read = Column(Boolean, default=False)
    read_at = Column(DateTime)
    is_edited = Column(Boolean, default=False)
    edited_at = Column(DateTime)
    reactions = Column(JSON, default={})
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)

# Create all tables
Base.metadata.create_all(bind=engine)

# ============= FASTAPI SETUP =============
app = FastAPI(
    title="EventAI - Messaging & Networking",
    version="2.0.0",
    description="Enterprise Event Management Platform"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============= SECURITY =============
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

# ============= PYDANTIC SCHEMAS =============

class UserRegister(BaseModel):
    email: str
    name: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class UserProfileCreate(BaseModel):
    full_name: str
    headline: str
    bio: str
    company: str
    job_title: str
    location: str
    interests: List[str] = []
    skills: List[str] = []
    looking_for: str = ""

class UserProfileResponse(BaseModel):
    id: int
    full_name: str
    headline: str
    bio: str
    company: str
    job_title: str
    location: str
    interests: List[str]
    skills: List[str]
    profile_completion_score: int

    class Config:
        from_attributes = True

class ConnectionRequest(BaseModel):
    recipient_id: int
    event_id: int
    custom_message: Optional[str] = None

class ConnectionResponse(BaseModel):
    id: int
    requester_id: int
    recipient_id: int
    status: str
    sent_at: datetime

    class Config:
        from_attributes = True

class MessageCreate(BaseModel):
    conversation_id: int
    content: str
    message_type: str = "text"

class MessageResponse(BaseModel):
    id: int
    conversation_id: int
    sender_id: int
    content: str
    created_at: datetime
    is_read: bool

    class Config:
        from_attributes = True

class ConversationResponse(BaseModel):
    id: int
    participant_1_id: int
    participant_2_id: int
    last_message: Optional[str]
    last_message_at: Optional[datetime]
    unread_count: int

    class Config:
        from_attributes = True

class ConversationCreate(BaseModel):
    participant_2_id: int
    event_id: int

# ============= DATABASE DEPENDENCY =============

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ============= ROOT ENDPOINTS =============

@app.get("/")
def root():
    return {
        "message": "EventAI API - Messaging & Networking",
        "version": "2.0.0",
        "docs": "/docs",
        "websocket": "ws://127.0.0.1:8000/ws/{user_id}"
    }

@app.get("/health")
def health():
    return {"status": "healthy", "service": "eventai"}

# ============= USER AUTHENTICATION ROUTES =============

@app.post("/api/users/register")
def register(user_data: UserRegister, db = Depends(get_db)):
    """Register a new user"""
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user = User(
        email=user_data.email,
        name=user_data.name,
        password_hash=hash_password(user_data.password)
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    
    return {
        "user_id": user.id,
        "email": user.email,
        "name": user.name,
        "message": "User registered successfully"
    }

@app.post("/api/users/login")
def login(user_data: UserLogin, db = Depends(get_db)):
    """Login user"""
    user = db.query(User).filter(User.email == user_data.email).first()
    if not user or not verify_password(user_data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = jwt.encode(
        {"sub": user.id},
        SECRET_KEY,
        algorithm=ALGORITHM
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_id": user.id
    }

# ============= PROFILE ROUTES =============

@app.get("/api/profiles/{user_id}")
def get_profile(user_id: int, db = Depends(get_db)):
    """Get user profile"""
    profile = db.query(UserProfile).filter(UserProfile.id == user_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile

@app.put("/api/profiles/{user_id}")
def update_profile(user_id: int, data: UserProfileCreate, db = Depends(get_db)):
    """Update user profile"""
    profile = db.query(UserProfile).filter(UserProfile.id == user_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    profile.full_name = data.full_name
    profile.headline = data.headline
    profile.bio = data.bio
    profile.company = data.company
    profile.job_title = data.job_title
    profile.location = data.location
    profile.interests = data.interests
    profile.skills = data.skills
    profile.looking_for = data.looking_for
    profile.updated_at = datetime.utcnow()
    profile.profile_completion_score = 90
    
    db.commit()
    db.refresh(profile)
    return profile

@app.post("/api/profiles/create")
def create_profile(data: UserProfileCreate, db = Depends(get_db)):
    """Create new user profile"""
    profile = UserProfile(
        full_name=data.full_name,
        headline=data.headline,
        bio=data.bio,
        company=data.company,
        job_title=data.job_title,
        location=data.location,
        interests=data.interests,
        skills=data.skills,
        looking_for=data.looking_for,
        profile_completion_score=90,
        event_id=1
    )
    db.add(profile)
    db.commit()
    db.refresh(profile)
    return profile

# ============= SEARCH ROUTES =============

@app.get("/api/search/people")
def search_people(
    q: str = Query(""),
    event_id: int = 1,
    limit: int = 20,
    db = Depends(get_db)
):
    """Search for people"""
    results = db.query(UserProfile).filter(
        UserProfile.event_id == event_id,
        (UserProfile.full_name.ilike(f"%{q}%")) |
        (UserProfile.headline.ilike(f"%{q}%")) |
        (UserProfile.company.ilike(f"%{q}%"))
    ).limit(limit).all()
    
    return {"total": len(results), "results": results}

# ============= CONNECTION ROUTES =============

@app.get("/api/connections")
def get_connections(
    user_id: int = 1,
    status: Optional[str] = None,
    event_id: int = 1,
    limit: int = 20,
    db = Depends(get_db)
):
    """Get user's connections"""
    query = db.query(Connection).filter(
        Connection.event_id == event_id,
        ((Connection.requester_id == user_id) | (Connection.recipient_id == user_id))
    )
    
    if status:
        query = query.filter(Connection.status == status)
    
    connections = query.limit(limit).all()
    return {"total": len(connections), "connections": connections}

@app.post("/api/connections/request")
def send_connection_request(req: ConnectionRequest, db = Depends(get_db)):
    """Send connection request"""
    
    existing = db.query(Connection).filter(
        ((Connection.requester_id == 1) & (Connection.recipient_id == req.recipient_id)) |
        ((Connection.requester_id == req.recipient_id) & (Connection.recipient_id == 1))
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Connection already exists")
    
    connection = Connection(
        requester_id=1,
        recipient_id=req.recipient_id,
        event_id=req.event_id,
        status="pending",
        custom_message=req.custom_message
    )
    
    db.add(connection)
    db.commit()
    db.refresh(connection)
    
    return connection

@app.put("/api/connections/{connection_id}")
def respond_to_connection(connection_id: int, action: str = "accept", db = Depends(get_db)):
    """Accept or reject connection"""
    connection = db.query(Connection).filter(Connection.id == connection_id).first()
    if not connection:
        raise HTTPException(status_code=404, detail="Connection not found")
    
    if action == "accept":
        connection.status = "accepted"
        connection.is_mutual = True
        connection.connected_at = datetime.utcnow()
    elif action == "reject":
        connection.status = "rejected"
    
    connection.responded_at = datetime.utcnow()
    db.commit()
    db.refresh(connection)
    
    return connection

@app.get("/api/connections/suggestions")
def get_connection_suggestions(event_id: int = 1, limit: int = 10, db = Depends(get_db)):
    """Get AI-powered connection suggestions"""
    all_users = db.query(UserProfile).filter(
        UserProfile.event_id == event_id
    ).limit(limit).all()
    
    suggestions = []
    for user in all_users:
        suggestions.append({
            "user": user,
            "match_score": 85,
            "reason": "Great networking match"
        })
    
    return {"suggestions": suggestions}

# ============= MESSAGING ROUTES =============

@app.get("/api/conversations")
def get_conversations(
    user_id: int = 1,
    event_id: int = 1,
    limit: int = 20,
    db = Depends(get_db)
):
    """Get user's conversations"""
    conversations = db.query(Conversation).filter(
        Conversation.event_id == event_id,
        ((Conversation.participant_1_id == user_id) | (Conversation.participant_2_id == user_id)),
        Conversation.is_archived == False
    ).limit(limit).all()
    
    return {"conversations": conversations, "total": len(conversations)}

@app.post("/api/conversations/create")
def create_conversation(data: ConversationCreate, db = Depends(get_db)):
    """Create or get existing conversation"""
    
    participant_1_id = 1
    participant_2_id = data.participant_2_id
    
    existing = db.query(Conversation).filter(
        Conversation.event_id == data.event_id,
        ((Conversation.participant_1_id == participant_1_id) & (Conversation.participant_2_id == participant_2_id)) |
        ((Conversation.participant_1_id == participant_2_id) & (Conversation.participant_2_id == participant_1_id))
    ).first()
    
    if existing:
        return existing
    
    conversation = Conversation(
        event_id=data.event_id,
        participant_1_id=participant_1_id,
        participant_2_id=participant_2_id
    )
    
    db.add(conversation)
    db.commit()
    db.refresh(conversation)
    
    return conversation

@app.get("/api/conversations/{conversation_id}/messages")
def get_messages(
    conversation_id: int,
    limit: int = 50,
    offset: int = 0,
    db = Depends(get_db)
):
    """Get messages from conversation"""
    messages = db.query(Message).filter(
        Message.conversation_id == conversation_id
    ).order_by(Message.created_at.desc()).offset(offset).limit(limit).all()
    
    return {"messages": messages, "total": len(messages)}

@app.post("/api/conversations/{conversation_id}/messages")
def send_message(conversation_id: int, msg: MessageCreate, db = Depends(get_db)):
    """Send a message"""
    
    conversation = db.query(Conversation).filter(Conversation.id == conversation_id).first()
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    message = Message(
        conversation_id=conversation_id,
        sender_id=1,
        content=msg.content,
        message_type=msg.message_type
    )
    
    db.add(message)
    
    conversation.last_message = msg.content
    conversation.last_message_at = datetime.utcnow()
    conversation.updated_at = datetime.utcnow()
    
    if conversation.participant_1_id == 1:
        conversation.unread_count_p2 += 1
    else:
        conversation.unread_count_p1 += 1
    
    db.commit()
    db.refresh(message)
    
    return message

@app.put("/api/messages/{message_id}/read")
def mark_message_read(message_id: int, db = Depends(get_db)):
    """Mark message as read"""
    message = db.query(Message).filter(Message.id == message_id).first()
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    
    message.is_read = True
    message.read_at = datetime.utcnow()
    db.commit()
    db.refresh(message)
    
    return message

# ============= WEBSOCKET ENDPOINT =============

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[int, list] = {}
    
    async def connect(self, user_id: int, websocket: WebSocket):
        await websocket.accept()
        if user_id not in self.active_connections:
            self.active_connections[user_id] = []
        self.active_connections[user_id].append(websocket)
    
    def disconnect(self, user_id: int, websocket: WebSocket):
        if user_id in self.active_connections:
            self.active_connections[user_id].remove(websocket)
            if not self.active_connections[user_id]:
                del self.active_connections[user_id]
    
    async def broadcast(self, message: dict):
        """Broadcast to all connected users"""
        for user_id in list(self.active_connections.keys()):
            for ws in self.active_connections[user_id]:
                try:
                    await ws.send_json(message)
                except:
                    pass
    
    async def send_personal(self, user_id: int, message: dict):
        """Send message to specific user"""
        if user_id in self.active_connections:
            for ws in self.active_connections[user_id]:
                try:
                    await ws.send_json(message)
                except:
                    pass

manager = ConnectionManager()

@app.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: int):
    """WebSocket endpoint for real-time communication"""
    await manager.connect(user_id, websocket)
    
    try:
        while True:
            data = await websocket.receive_json()
            
            if data.get("type") == "typing":
                await manager.send_personal(data.get("recipient_id"), {
                    "type": "typing",
                    "user_id": user_id,
                    "is_typing": data.get("is_typing", True)
                })
            
            elif data.get("type") == "message":
                await manager.broadcast({
                    "type": "new_message",
                    "user_id": user_id,
                    "content": data.get("content"),
                    "timestamp": datetime.utcnow().isoformat()
                })
            
            elif data.get("type") == "online_status":
                await manager.broadcast({
                    "type": "user_status",
                    "user_id": user_id,
                    "status": "online"
                })
    
    except WebSocketDisconnect:
        manager.disconnect(user_id, websocket)
        await manager.broadcast({
            "type": "user_status",
            "user_id": user_id,
            "status": "offline"
        })

# ============= EVENT ROUTES (WEEK 1-4) =============

@app.get("/api/events")
def list_events(skip: int = 0, limit: int = 10, db = Depends(get_db)):
    """Get all events"""
    events = db.query(Event).offset(skip).limit(limit).all()
    return [
        {
            "id": event.id,
            "name": event.name,
            "description": event.description,
            "location": event.location,
            "date": event.date
        }
        for event in events
    ]

@app.post("/api/events")
def create_event(event_data, db = Depends(get_db)):
    """Create event"""
    event = Event(
        name=event_data.get("name"),
        description=event_data.get("description"),
        date=event_data.get("date"),
        location=event_data.get("location")
    )
    db.add(event)
    db.commit()
    db.refresh(event)
    return event

@app.get("/api/events/{event_id}")
def get_event(event_id: int, db = Depends(get_db)):
    """Get event by ID"""
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event

# ============= SESSION ROUTES (WEEK 1-4) =============

@app.get("/api/events/{event_id}/sessions")
def list_sessions(event_id: int, db = Depends(get_db)):
    """Get sessions for event"""
    sessions = db.query(Session).filter(Session.event_id == event_id).all()
    return sessions

@app.post("/api/sessions")
def create_session(session_data, db = Depends(get_db)):
    """Create session"""
    session = Session(
        event_id=session_data.get("event_id"),
        title=session_data.get("title"),
        description=session_data.get("description"),
        speaker_name=session_data.get("speaker_name"),
        start_time=session_data.get("start_time"),
        end_time=session_data.get("end_time")
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    return session

@app.get("/api/sessions/{session_id}")
def get_session(session_id: int, db = Depends(get_db)):
    """Get session by ID"""
    session = db.query(Session).filter(Session.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return session

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
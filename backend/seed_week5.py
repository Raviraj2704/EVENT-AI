from datetime import datetime
from models import UserProfile, Connection, Conversation
from main import engine, SessionLocal, Base

def seed_messaging_data():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Create 10 sample profiles
    for i in range(1, 11):
        profile = UserProfile(
            user_id=i,
            full_name=f"Professional {i}",
            email=f"prof{i}@eventai.com",
            headline=f"HR Executive at Company{i}",
            bio="Passionate about HR Tech and AI solutions",
            company=f"Company {i}",
            job_title="HR Manager",
            location="Hyderabad, India",
            profile_completion_score=90,
            event_id=1
        )
        db.add(profile)
    
    db.commit()
    db.close()
    print("Sample data seeded successfully!")

if __name__ == "__main__":
    seed_messaging_data()
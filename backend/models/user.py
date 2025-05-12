from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from database.base import Base
from datetime import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    github_id = Column(Integer, nullable=False, unique=True)
    username = Column(String(255), nullable=False, unique=True)
    name = Column(String(255), nullable=True)
    avatar_url = Column(String(255), nullable=True)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)

    # Relationship
    repositories = relationship("Repository", back_populates="user", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<User(id={self.id}, username={self.username}, name={self.name})>"

from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from pgvector.sqlalchemy import Vector
from database.base import Base
from typing import List
from pydantic import BaseModel
from datetime import datetime

class Repository(Base):
    __tablename__ = "repositories"

    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    language = Column(String(255))
    created_at = Column(DateTime, nullable=False)
    updated_at = Column(DateTime, nullable=False)
    added_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    url = Column(String(255), nullable=False)
    author = Column(String(255), nullable=False)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    embedding = Column(Vector(1536))  # Using pgvector's Vector type with dimension 1536

    # Relationship
    commits = relationship("Commit", back_populates="repository", cascade="all, delete-orphan")
    user = relationship("User", back_populates="repositories")

    def __repr__(self):
        return f"<Repository(id={self.id}, name={self.name}, url={self.url})>"

class RepositoryResponse(BaseModel):
    id: int
    name: str
    description: str | None
    language: str | None
    created_at: datetime
    updated_at: datetime
    added_at: datetime
    url: str
    author: str

    class Config:
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }
    
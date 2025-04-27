from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.orm import relationship
from pgvector.sqlalchemy import Vector

Base = declarative_base()

class Repository(Base):
    __tablename__ = "repositories"

    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    language = Column(String(255))
    created_at = Column(DateTime, nullable=False)
    updated_at = Column(DateTime, nullable=False)
    added_at = Column(DateTime(timezone=True), server_default='now()')
    url = Column(String(255), nullable=False)
    author = Column(String(255), nullable=False)
    embedding = Column(Vector(1536))  # Using pgvector's Vector type with dimension 1536

    # Relationship
    commits = relationship("Commit", back_populates="repository", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Repository(id={self.id}, name={self.name}, url={self.url})>"
    
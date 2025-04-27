from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, String, Text, DateTime, Integer, ForeignKey
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import relationship
from pgvector.sqlalchemy import Vector

Base = declarative_base()

class Commit(Base):
    __tablename__ = "commits"

    sha = Column(String(40), primary_key=True)  # Git SHA-1 is always 40 characters
    repository_id = Column(Integer, ForeignKey('repositories.id', ondelete='CASCADE'), nullable=False)
    branch_name = Column(String(255), nullable=False)
    message = Column(Text)
    added_at = Column(DateTime(timezone=True), server_default='now()')
    created_at = Column(DateTime(timezone=True), nullable=False)
    author = Column(String(255), nullable=False)
    date = Column(DateTime, nullable=False)
    files_changed = Column(ARRAY(String))
    embedding = Column(Vector(1536))  # Using pgvector's Vector type with dimension 1536

    # Relationship
    repository = relationship("Repository", back_populates="commits")

    def __repr__(self):
        return f"<Commit(sha={self.sha}, message={self.message}, author={self.author}, date={self.date})>"

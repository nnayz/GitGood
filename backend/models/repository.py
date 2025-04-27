from pydantic import BaseModel
from datetime import datetime

class Repository(BaseModel):
    id: str
    name: str
    description: str | None = None
    url: str
    language: str | None = None
    created_at: datetime
    updated_at: datetime | None = None
    author: str
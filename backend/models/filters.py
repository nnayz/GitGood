from pydantic import BaseModel
from datetime import datetime

class Filters(BaseModel):
    branch: str | None = None
    author: str | None = None
    start_date: datetime | None = None
    end_date: datetime | None = None
    added_at: str | None = None
    created_at: str | None = None
    files_changed: list[str] | None = None
    
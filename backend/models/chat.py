from pydantic import BaseModel

class ChatRequest(BaseModel):
    message: str | None = None
    repository_id: int | None = None
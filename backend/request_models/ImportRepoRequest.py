from pydantic import BaseModel

class ImportRepoRequest(BaseModel):
    url: str

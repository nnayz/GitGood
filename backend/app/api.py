from fastapi import FastAPI, Header, Depends
from database.db import get_session
from sqlalchemy.orm import Session
from github_api.import_repository import get_repository_by_url

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post("/import-repo")
async def import_repo(user_id: str = Header(...), repo_url: str = Header(...), session: Session = Depends(get_session)):
    repository_obj = get_repository_by_url(repo_url)
    return {"repository": repository_obj}
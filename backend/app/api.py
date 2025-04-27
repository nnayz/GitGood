from fastapi import FastAPI, Header, Depends
from database.db import get_session
from sqlalchemy.orm import Session
from github_api.import_repository import get_repository_by_url, add_repository_to_db
from models.repository import Repository
from database.db import run_sql_file

app = FastAPI()

run_sql_file("database/sql_tables.sql")

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post("/import-repo")
async def import_repo(user_id: str = Header(...), repo_url: str = Header(...), session: Session = Depends(get_session)):
    repository_obj = get_repository_by_url(repo_url)
    add_repository_to_db(repository_obj)
    return { "message": "Repository imported successfully" }

@app.get('/getAllRepositories')
async def get_all_repositories(session: Session = Depends(get_session)):
    return {"repositories": session.query(Repository).all()}
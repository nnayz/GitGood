from fastapi import FastAPI, Header, Depends
from database.db import get_db
from sqlalchemy.orm import Session
from github_api.import_repository import get_repository_by_url, add_repository_to_db
from models.repository import Repository, RepositoryResponse
from models.commit import CommitResponse, Commit
from database.db import run_sql_file
from typing import List

app = FastAPI()

run_sql_file("database/sql_tables.sql")

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post("/import-repo")
async def import_repo(user_id: str = Header(...), repo_url: str = Header(...), db: Session = Depends(get_db)):
    repository_obj = get_repository_by_url(repo_url)
    add_repository_to_db(repository_obj)
    return { "message": "Repository imported successfully" }

@app.get('/getAllRepositories', response_model=List[RepositoryResponse])
async def get_all_repositories(db: Session = Depends(get_db)):
    repositories = db.query(Repository).all()
    return repositories

@app.get('/repositories/{repository_id}', response_model=RepositoryResponse)
async def get_repository(repository_id: int, db: Session = Depends(get_db)):
    repository = db.query(Repository).filter(Repository.id == repository_id).first()
    return repository

@app.get('/repositories/{repository_id}/commits', response_model=List[CommitResponse])
async def get_commits(repository_id: int, db: Session = Depends(get_db)):
    commits = db.query(Commit).filter(Commit.repository_id == repository_id).all()
    return commits


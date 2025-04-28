from fastapi import FastAPI, Header, Depends
from database.db import get_db
from sqlalchemy.orm import Session
from github_api.import_repository import get_repository_by_url, add_repository_to_db
from models.repository import Repository, RepositoryResponse
from models.commit import CommitResponse, Commit
from database.db import run_sql_file
from typing import List
from models.chat import ChatRequest
from filters.filters import extract_filters
from models.filters import Filters

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

@app.post('/repositories/{repository_id}/chat')
async def chat(
    request: ChatRequest,
    user_id: str = Header(...),
    db: Session = Depends(get_db)
):
    if request.message == "" or request.message is None:
        return { "message": "Please provide a message" }
    if request.repository_id is None:
        return { "message": "Please provide a repository id" }
    
    repository = db.query(Repository).filter(Repository.id == request.repository_id).first()
    if repository is None:
        return { "message": "Repository not found" }
    
    commits = db.query(Commit).filter(Commit.repository_id == request.repository_id).all()
    if len(commits) == 0:
        return { "message": "No commits found" }
    
    filters = extract_filters(request.message, commits)
    
    # Apply filters to the commits query
    query = db.query(Commit).filter(Commit.repository_id == request.repository_id)
    
    if filters.branch:
        query = query.filter(Commit.branch_name == filters.branch)
    if filters.author:
        query = query.filter(Commit.author.ilike(f"%{filters.author}%"))
    if filters.start_date:
        query = query.filter(Commit.date >= filters.start_date)
    if filters.end_date:
        query = query.filter(Commit.date <= filters.end_date)
    
    filtered_commits = query.all()
    
    return {
        "message": "Here are the commits matching your criteria",
        "filters": filters.model_dump(),
        "commits": [CommitResponse.model_validate(commit).model_dump() for commit in filtered_commits]
    }


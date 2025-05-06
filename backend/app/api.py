from fastapi import FastAPI, Header, Depends, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
import requests
import os
from database.db import get_db
from sqlalchemy.orm import Session
from github_api.import_repository import get_repository_by_url, add_repository_to_db
from models.repository import Repository, RepositoryResponse
from models.commit import CommitResponse, Commit
from database.db import run_sql_file
from typing import List
from models.chat import ChatRequest
from filters.filters import extract_filters
from embeddings.embed_text import embed_text
import numpy as np
from llm_client.client import get_client
from github_api.client import get_github_client
from dotenv import load_dotenv

load_dotenv()

def cosine(a: np.ndarray, b: np.ndarray) -> float:
    return float(a @ b / (np.linalg.norm(a) * np.linalg.norm(b)))

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

run_sql_file("database/sql_tables.sql")

@app.post('/auth/github/callback')
async def github_callback(request: Request):
    data = await request.json()
    code = data.get('code')
    
    # Exchange code for token
    token_url = 'https://github.com/login/oauth/access_token'
    response = requests.post(
        token_url,
        headers={'Accept': 'application/json'},
        data={
            'client_id': os.getenv('GITHUB_CLIENT_ID'),
            'client_secret': os.getenv('GITHUB_CLIENT_SECRET'),
            'code': code
        }
    )
    
    if response.status_code != 200:
        raise HTTPException(status_code=400, detail="Failed to obtain access token")
        
    token_data = response.json()
    access_token = token_data.get('access_token')
    
    # Get user info
    user_response = requests.get(
        'https://api.github.com/user',
        headers={
            'Authorization': f'token {access_token}',
            'Accept': 'application/json'
        }
    )
    
    if user_response.status_code != 200:
        raise HTTPException(status_code=400, detail="Failed to get user info")
        
    user_data = user_response.json()
    
    # Return the token and user info
    return {
        "token": access_token,
        "user": {
            "id": user_data.get('id'),
            "login": user_data.get('login'),
            "name": user_data.get('name'),
            "avatar_url": user_data.get('avatar_url')
        }
    }


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
    
    filters = extract_filters(request.message, db, request.repository_id)
    
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

    # Embed the user query
    user_query_embedding = embed_text(request.message)

    # Using cosine similarity find similarities between the user query and the commits
    scores = []
    for commit in filtered_commits:
        score = cosine(user_query_embedding, commit.embedding)
        scores.append((commit, score))
    
    # Sort the commits by score
    scores.sort(key=lambda x: x[1], reverse=True)
    for score in scores:
        print(score[1])
    mean_score = np.mean([score for _, score in scores])
    std_score = np.std([score for _, score in scores])

    # Define a threshold for the score
    threshold = mean_score + 2 * std_score
    filtered_commits = [commit for commit, score in scores if score >= threshold]

    if not filtered_commits:
        threshold = mean_score
        filtered_commits = [commit for commit, score in scores if score >= threshold]
        
        if not filtered_commits:
            filtered_commits = scores[:3]

    github_client = get_github_client()
    repo = github_client.get_repo(repository.url.split("https://github.com/")[1])

    commits_as_context = []
    for commit in filtered_commits:
        commit_details = repo.get_commit(commit.sha)
        file_contexts = []
        for file in commit_details.files:
            file_contexts.append(
                f"Commit file change: {file.filename}\n"
                f"Patch: {file.patch}\n"
                f"Status: {file.status}\n"
                f"Additions: {file.additions}\n"
                f"Deletions: {file.deletions}\n"
                f"Changes: {file.changes}\n"
            )
        file_context_str = "\n".join(file_contexts)
        commits_as_context.append(
            f"Commit sha: {commit_details.sha}\n"
            f"Commit message: {commit_details.commit.message}\n"
            f"Commit author: {commit_details.author.name}\n"
            f"Commit author username: {commit_details.author.login}\n"
            f"Commit date: {commit_details.commit.author.date}\n"
            f"{file_context_str}\n"
        )

    commits_as_context = "\n".join(commits_as_context)
    llm_client = get_client()
    llm_prompt = f"""
    Your are a helpful assistant that can answer questions about the commits. The user asked: {request.message}
    Here are the most relevant commits:
    {commits_as_context}
    Based on these commits and the user query, answer the user's question.
    """
    response = llm_client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": llm_prompt}],
    )

    response_message = response.choices[0].message.content
    return {
        "message": response_message,
        "filters": filters.model_dump(),
        "commits": [CommitResponse.model_validate(commit).model_dump() for commit in filtered_commits],
    }


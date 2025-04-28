from github_api.client import get_github_client
from database.db import get_session
from models.commit import Commit
from datetime import datetime
from embeddings.embed_commits import embed_commits
def get_all_branches(repository_id: str):
    g = get_github_client()
    repo = g.get_repo(repository_id)
    branches = repo.get_branches()
    return branches

def get_all_commits(branches, repo):
    all_commits = []
    for branch in branches:
        commits = repo.get_commits(sha=branch.commit.sha)
        for commit in commits:
            commit_data = {
                "sha": commit.sha,
                "branch_name": branch.name,
                "message": commit.commit.message,
                "added_at": datetime.now(),
                "created_at": commit.commit.author.date,
                "author": commit.commit.author.name,
                "date": commit.commit.author.date,
                "files_changed": [file.filename for file in commit.files] if commit.files else [],
                "embedding": None,
                "repository_id": repo.id,
            }
            all_commits.append(commit_data)
    return all_commits

def populate_commits(repository_id: str):
    g = get_github_client()
    repo = g.get_repo(repository_id)
    branches = get_all_branches(repository_id)
    commits = get_all_commits(branches, repo)
    commits = embed_commits(commits)
    for commit in commits:
        commit = Commit(**commit)
        with get_session() as session:
            session.add(commit)
            session.commit()
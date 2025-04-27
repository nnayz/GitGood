from github_api.client import get_github_client
from database.db import get_session
from models.commit import Commit
from datetime import datetime
def get_all_branches(repository_id: str):
    g = get_github_client()
    repo = g.get_repo(repository_id)
    branches = repo.get_branches()
    return branches

def get_all_commits(branches, repo):
    for branch in branches:
        commits = repo.get_commits(sha=branch.commit.sha)
        

        
def populate_commmits(repository_id: str):
    g = get_github_client()
    repo = g.get_repo(repository_id)
    branches = get_all_branches(repository_id)
    commits = get_all_commits(branches, repo)

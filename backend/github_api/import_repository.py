from github import Github
import os 
from models.repository import Repository

def get_github_client():
    return Github(os.getenv("GITHUB_TOKEN"))

def format_url(url: str):
    if url.startswith("https://github.com/"):
        return url.split("https://github.com/")[1]
    return url

def get_repository_by_url(url: str):
    g = get_github_client()
    repo = g.get_repo(format_url(url))
    repo_obj = Repository(
        id=str(repo.id),
        name=str(repo.name),
        description=str(repo.description),
        url=str(repo.html_url),
        language=str(repo.language),
        created_at=str(repo.created_at),
        updated_at=str(repo.updated_at),
        author=str(repo.owner.login),
    )
    return repo_obj

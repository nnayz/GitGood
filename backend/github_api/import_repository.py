from models.repository import Repository
from database.db import get_session
from github_api.client import get_github_client
from embeddings.embed_repository import embed_repository
from github_api.populate_commits import populate_commits
from sqlalchemy.exc import IntegrityError

def format_url(url: str):
    if url.startswith("https://github.com/"):
        return url.split("https://github.com/")[1]
    return url

def get_repository_by_url(url: str):
    g = get_github_client()
    repo = g.get_repo(format_url(url))
    
    # Create repository object with all required fields
    repo_obj = Repository(
        id=repo.id,
        name=repo.name,
        description=repo.description or "",  # Handle None case
        language=repo.language or "",  # Handle None case
        created_at=repo.created_at,
        updated_at=repo.updated_at,
        url=repo.html_url,
        author=repo.owner.login,
        embedding=None  # Will be populated by embed_repository
    )
    
    # Generate embedding for the repository
    repo_obj = embed_repository(repo_obj)
    return repo_obj

def add_repository_to_db(repo_obj: Repository):
    with get_session() as session:
        try:
            # Try to add the repository
            session.add(repo_obj)
            session.commit()
            
            # Refresh the object to ensure it's attached to the session
            session.refresh(repo_obj)
            
            # Now we can safely access repo_obj.id
            repository_id = repo_obj.id
            
            # Populate commits for this repository
            populate_commits(repository_id)
            
            return True, "Repository added successfully"
            
        except IntegrityError:
            # If repository already exists, update it
            session.rollback()
            existing_repo = session.query(Repository).filter_by(id=repo_obj.id).first()
            
            if existing_repo:
                # Update the existing repository
                for key, value in repo_obj.__dict__.items():
                    if not key.startswith('_'):
                        setattr(existing_repo, key, value)
                
                session.commit()
                session.refresh(existing_repo)
                
                # Populate commits for the existing repository
                populate_commits(existing_repo.id)
                
                return True, "Repository updated successfully"
            else:
                return False, "Error adding repository"

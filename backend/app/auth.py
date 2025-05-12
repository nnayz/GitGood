from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from database.db import get_db, get_session
from models.user import User
import requests
security = HTTPBearer()

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    token = credentials.credentials
    
    # Verify the token with GitHub API
    user_response = requests.get(
        'https://api.github.com/user',
        headers={
            'Authorization': f'token {token}',
            'Accept': 'application/json'
        }
    )
    
    if user_response.status_code != 200:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )
    
    user_data = user_response.json()
    
    # Get or create user in our database
    user = db.query(User).filter(User.github_id == user_data['id']).first()
    if not user:
        user = User(
            github_id=user_data['id'],
            username=user_data['login'],
            name=user_data.get('name'),
            avatar_url=user_data.get('avatar_url')
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    
    return user

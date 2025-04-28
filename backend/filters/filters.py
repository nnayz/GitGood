from llm_client.client import get_client
from models.filters import Filters
from datetime import datetime, timedelta
import re
from typing import List
from sqlalchemy.orm import Session
from models.commit import Commit

client = get_client()
MODEL = "gpt-4o"
TEMPERATURE = 0.1  # Slightly more creative responses



def get_unique_authors(db: Session, repository_id: int) -> List[str]:
    """Returns a list of unique authors from the database"""
    return [author[0] for author in db.query(Commit.author).filter(Commit.repository_id == repository_id).distinct().all()]

def get_unique_branches(db: Session, repository_id: int) -> List[str]:
    """Returns a list of unique branches from the database"""
    return [branch[0] for branch in db.query(Commit.branch_name).filter(Commit.repository_id == repository_id).distinct().all()]

def extract_branch(message: str, branches: list[str]):
    """
    Returns the branch name from the message
    """
    system_prompt = f"""
    You are a helpful git assistant. Your task is to find which branch the user is asking about.
    
    IMPORTANT: You MUST return one of these exact branch names or $NaN$:
    {', '.join(branches)}
    
    Examples:
    User: "Show me changes in main"
    You: "main"
    
    User: "What's in the development branch?"
    You: If "development" is in the available branches, return "development". Otherwise return $NaN$
    
    Rules:
    1. You MUST return one of the exact branch names listed above
    2. If you can't determine which branch, return $NaN$
    3. Do not return partial names or variations
    4. Do not return explanations or additional text
    
    Return ONLY one of these exact values: {', '.join(branches)} or $NaN$
    """
    
    response = client.chat.completions.create(
        model=MODEL,
        temperature=TEMPERATURE,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": message}
        ]
    )

    result = response.choices[0].message.content.strip()
    print(f"Branch extraction result: {result}")
    
    if result == "$NaN$" or result not in branches:
        return None
    return result

def extract_author(message: str, authors: list[str], db: Session, repository_id: int):
    """
    Extracts author information from the user's message
    """
    
    system_prompt = f"""
    You are a helpful git assistant. Your task is to find which author the user is asking about.
    The user might make a mistake in their message, so you should be flexible. Give the user the benefit of the doubt. The author names provided might not be exactly as the user wrote them.
    IMPORTANT: You MUST return one of these exact author names or $NaN$:
    {', '.join(authors)}
    
    Examples:
    User: "Show me John's commits"
    You: If "John" is in the available authors, return "John". Otherwise return $NaN$
    
    User: "What did Alice work on?"
    You: If "Alice" is in the available authors, return "Alice". Otherwise return $NaN$
    
    Rules:
    1. You MUST return one of the exact author names listed above
    2. If you can't determine which author, return $NaN$
    3. Do not return partial names or variations
    4. Do not return explanations or additional text
    
    Return ONLY one of these exact values: {', '.join(authors)} or $NaN$
    """
    
    response = client.chat.completions.create(
        model=MODEL,
        temperature=TEMPERATURE,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": message}
        ]
    )
    
    result = response.choices[0].message.content.strip()
    print(f"Author extraction result: {result}")
    
    if result == "$NaN$" or result not in authors:
        return None
    return result

def extract_dates(message: str):
    """
    Extracts date range information from the user's message and returns datetime objects
    """
    now = datetime.now()
    current_date = now.strftime("%Y-%m-%d")
    
    system_prompt = f"""
    You are a helpful git assistant. Your task is to find date range information in the user's message.
    Today's date is {current_date}.
    
    For relative time expressions, calculate the actual dates:
    - "last week" -> 7 days before today
    - "last month" -> 30 days before today
    - "last year" -> 365 days before today
    - "yesterday" -> 1 day before today
    
    Examples:
    User: "commits in last week"
    You: "2024-03-14,2024-03-21"  # Assuming today is March 21st
    
    User: "changes since last month"
    You: "2024-02-21,2024-03-21"  # 30 days before today
    
    User: "commits between March 1st and March 15th"
    You: "2024-03-01,2024-03-15"
    
    Rules:
    1. Always return dates in ISO format (YYYY-MM-DD)
    2. Separate start and end dates with a comma
    3. For relative time, calculate the actual dates based on today's date
    4. If no dates are found, return $NaN$
    
    Return ONLY the dates in ISO format or $NaN$.
    """
    
    response = client.chat.completions.create(
        model=MODEL,
        temperature=TEMPERATURE,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": message}
        ]
    )
    
    result = response.choices[0].message.content.strip()
    print(f"Dates extraction result: {result}")
    
    if result == "$NaN$":
        return None, None
    
    # Handle dates
    dates = result.split(',')
    if len(dates) == 2:
        try:
            start_date = datetime.fromisoformat(dates[0].strip())
            end_date = datetime.fromisoformat(dates[1].strip())
            print(f"Converted dates: start={start_date.isoformat()}, end={end_date.isoformat()}")
            return start_date, end_date
        except ValueError:
            return None, None
            
    return None, None

def extract_files_changed(message: str):
    """
    Extracts file names or patterns from the user's message
    """
    system_prompt = """
    You are a helpful git assistant. Your task is to find file-related information in the user's message.
    
    Examples:
    User: "changes to README"
    You: "README.md"
    
    User: "Java files"
    You: "*.java"
    
    User: "src/main"
    You: "src/main/*"
    
    User: "modified the config file"
    You: "config*"
    
    If no file information is found, return $NaN$.
    Return ONLY the file pattern or $NaN$.
    """
    
    response = client.chat.completions.create(
        model=MODEL,
        temperature=TEMPERATURE,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": message}
        ]
    )
    
    result = response.choices[0].message.content.strip()
    print(f"Files extraction result: {result}")
    
    if result == "$NaN$":
        return None
    
    # Split the response into a list of files
    files = [f.strip() for f in result.split(',')]
    return files if files else None

def extract_filters(message: str, db: Session, repository_id: int) -> Filters:
    """
    Extracts all filters from the user's message
    """
    print(f"Extracting filters from message: {message}")
    
    # Get unique authors and branches from the database
    authors = get_unique_authors(db, repository_id)
    branches = get_unique_branches(db, repository_id)
    
    print(f"Available authors: {authors}")
    print(f"Available branches: {branches}")
    
    branch = extract_branch(message, branches)
    author = extract_author(message, authors, db, repository_id)
    start_date, end_date = extract_dates(message)
    files_changed = extract_files_changed(message)
    
    filters = Filters(
        branch=branch,
        author=author,
        start_date=start_date,
        end_date=end_date,
        files_changed=files_changed
    )
    
    print(f"Extracted filters: {filters.model_dump()}")
    return filters

from llm_client.client import get_client
from models.filters import Filters
from datetime import datetime
import re
from typing import List

client = get_client()
MODEL = "gpt-4o"
TEMPERATURE = 0.1  # Slightly more creative responses

def get_unique_authors(commits: List) -> List[str]:
    """Returns a list of unique authors from the commits"""
    return list(set(commit.author for commit in commits))

def get_unique_branches(commits: List) -> List[str]:
    """Returns a list of unique branches from the commits"""
    return list(set(commit.branch_name for commit in commits))

def extract_branch(message: str, branches: list[str]):
    """
    Returns the branch name from the message
    """
    system_prompt = f"""
    You are a helpful git assistant. Here is a list of unique branches in the repository: {branches}.
    Your task is to determine which branch the user is asking about.
    
    Examples:
    - "Show me changes in main" -> "main"
    - "What's in the development branch?" -> Look for "development" in {branches}
    - "Who worked on feature/login?" -> Look for "feature/login" in {branches}
    
    If the user doesn't specify a branch, return $NaN$.
    Return only the branch name or $NaN$.
    """

    response = client.chat.completions.create(
        model=MODEL,
        temperature=TEMPERATURE,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": message}
        ]
    )

    result = response.choices[0].message.content
    print(f"Branch extraction result: {result}")
    
    if result == "$NaN$" or result not in branches:
        return None
    return result

def extract_author(message: str, authors: list[str]):
    """
    Extracts author information from the user's message
    """
    system_prompt = f"""
    You are a helpful git assistant. Here is a list of unique authors in the repository: {authors}.
    Your task is to find who the user is asking about.
    
    Examples:
    - "Who built the Java Application?" -> Look for authors who worked on Java files
    - "Show me John's commits" -> "John"
    - "What did Alice work on?" -> "Alice"
    
    If you can't determine a specific author, return $NaN$.
    Return only the author name or $NaN$.
    """
    
    response = client.chat.completions.create(
        model=MODEL,
        temperature=TEMPERATURE,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": message}
        ]
    )
    
    result = response.choices[0].message.content
    print(f"Author extraction result: {result}")
    
    if result == "$NaN$" or result not in authors:
        return None
    return result

def extract_dates(message: str):
    """
    Extracts date range information from the user's message
    """
    system_prompt = """
    You are a helpful git assistant. Your task is to find time-related information in the user's message.
    
    Examples:
    - "recent changes" -> "relative:week:1"
    - "last month" -> "relative:month:1"
    - "since January" -> "2024-01-01,2024-03-21"
    - "changes in the past week" -> "relative:week:1"
    
    If no time information is found, return $NaN$.
    Return only the time expression or $NaN$.
    """
    
    response = client.chat.completions.create(
        model=MODEL,
        temperature=TEMPERATURE,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": message}
        ]
    )
    
    result = response.choices[0].message.content
    print(f"Dates extraction result: {result}")
    
    if result == "$NaN$":
        return None, None
    
    # Handle relative time expressions
    if result.startswith("relative:"):
        parts = result.split(":")
        if len(parts) != 3:
            return None, None
            
        period = parts[1]
        number = int(parts[2])
        
        from datetime import datetime, timedelta
        end_date = datetime.now()
        
        if period == "day":
            start_date = end_date - timedelta(days=number)
        elif period == "week":
            start_date = end_date - timedelta(weeks=number)
        elif period == "month":
            start_date = end_date - timedelta(days=30 * number)
        elif period == "year":
            start_date = end_date - timedelta(days=365 * number)
        else:
            return None, None
            
        return start_date, end_date
    
    # Handle absolute dates
    dates = result.split(',')
    if len(dates) == 2:
        try:
            start_date = datetime.fromisoformat(dates[0].strip())
            end_date = datetime.fromisoformat(dates[1].strip())
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
    - "changes to README" -> "README.md"
    - "Java files" -> "*.java"
    - "src/main" -> "src/main/*"
    - "modified the config file" -> "config*"
    
    If no file information is found, return $NaN$.
    Return only the file pattern or $NaN$.
    """
    
    response = client.chat.completions.create(
        model=MODEL,
        temperature=TEMPERATURE,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": message}
        ]
    )
    
    result = response.choices[0].message.content
    print(f"Files extraction result: {result}")
    
    if result == "$NaN$":
        return None
    
    # Split the response into a list of files
    files = [f.strip() for f in result.split(',')]
    return files if files else None

def extract_filters(message: str, commits: List) -> Filters:
    """
    Extracts all filters from the user's message
    """
    print(f"Extracting filters from message: {message}")
    
    # Get unique authors and branches
    authors = get_unique_authors(commits)
    branches = get_unique_branches(commits)
    
    print(f"Available authors: {authors}")
    print(f"Available branches: {branches}")
    
    branch = extract_branch(message, branches)
    author = extract_author(message, authors)
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

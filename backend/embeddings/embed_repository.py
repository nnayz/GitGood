from openai import OpenAI
import os

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

MODEL = "text-embedding-3-small"
DIMS = 1536

def embed_repository(repo_obj):
    # Create a detailed text representation of the repository
    embedding_text = f"""
    Repository Name: {repo_obj.name}
    Description: {repo_obj.description}
    Language: {repo_obj.language}
    Author: {repo_obj.author}
    Created At: {repo_obj.created_at}
    Updated At: {repo_obj.updated_at}
    URL: {repo_obj.url}
    """
        
        # Get embedding from OpenAI
    response = client.embeddings.create(
        model=MODEL,
        input=embedding_text,
        dimensions=DIMS
    )
    
    # Store the embedding
    repo_obj.embedding = response.data[0].embedding

    return repo_obj

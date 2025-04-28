from llm_client.client import get_client

client = get_client()

MODEL = "text-embedding-3-small"
DIMS = 1536

def embed_commits(commits):
    for commit in commits:
        # Create a detailed text representation of the commit
        embedding_text = f"""
        Commit SHA: {commit['sha']}
        Branch: {commit['branch_name']}
        Author: {commit['author']}
        Date: {commit['date']}
        Message: {commit['message']}
        
        Files Changed:
        {', '.join(commit['files_changed'])}
        
        Changes:
        """
        
        # Add patch information for each file
        for file in commit.get('files', []):
            if hasattr(file, 'patch') and file.patch:
                embedding_text += f"""
                File: {file.filename}
                Patch:
                {file.patch}
                Status: {file.status}
                Additions: {file.additions}
                Deletions: {file.deletions}
                Changes: {file.changes}
                """
        
        # Get embedding from OpenAI
        response = client.embeddings.create(
            model=MODEL,
            input=embedding_text,
            dimensions=DIMS
        )
        
        # Store the embedding
        commit['embedding'] = response.data[0].embedding

    return commits
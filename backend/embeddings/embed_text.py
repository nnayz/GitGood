from llm_client.client import get_client

client = get_client()

MODEL = "text-embedding-3-small"
DIMS = 1536

def embed_text(text: str):
    response = client.embeddings.create(
        model=MODEL,
        input=text,
        dimensions=DIMS
    )
    return response.data[0].embedding

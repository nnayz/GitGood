-- Enable vector extension for embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- Create repositories table
CREATE TABLE IF NOT EXISTS repositories (
    id INTEGER PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    language VARCHAR(255),
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    added_at TIMESTAMPTZ DEFAULT NOW(),
    url VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    embedding VECTOR(1536)
);

CREATE INDEX IF NOT EXISTS idx_repositories_id ON repositories (id);
COMMENT ON TABLE repositories IS 'Stores information about the GitHub repositories being tracked by GitSum.';

-- Create commits table
CREATE TABLE IF NOT EXISTS commits (
    sha VARCHAR(40) PRIMARY KEY,
    repository_id INTEGER NOT NULL,
    branch_name VARCHAR(255) NOT NULL,
    message TEXT,
    added_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL,
    author VARCHAR(255) NOT NULL,
    date TIMESTAMP NOT NULL,
    files_changed TEXT[],
    embedding VECTOR(1536) NOT NULL,

    CONSTRAINT fk_repository
        FOREIGN KEY (repository_id)
        REFERENCES repositories(id)
        ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_commits_repository_id ON commits (repository_id);
CREATE INDEX IF NOT EXISTS idx_commits_embedding ON commits USING HNSW (embedding vector_cosine_ops);

-- Add comments
COMMENT ON TABLE commits IS 'Stores Git commit information and their corresponding vector embeddings for semantic search.';
COMMENT ON COLUMN commits.sha IS 'Unique Git commit hash (SHA-1).';
COMMENT ON COLUMN commits.repository_id IS 'Foreign key referencing the specific repository this commit belongs to.';
COMMENT ON COLUMN commits.embedding IS 'Vector embedding representing the commit content (message, diff summary, etc.). Dimension depends on the model used (e.g., 384 for all-MiniLM-L6-v2).';
COMMENT ON INDEX idx_commits_embedding IS 'HNSW index on commit embeddings using cosine distance for efficient similarity search.';





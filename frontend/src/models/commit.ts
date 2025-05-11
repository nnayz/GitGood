export interface Commit {
    sha: string;
    repository_id: number;
    branch_name: string;
    message: string;
    added_at: string;
    created_at: string;
    author: string;
    date: string;
    files_changed: string[];
    embedding: number[];
}
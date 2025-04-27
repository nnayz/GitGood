from github import Github
import os

def get_github_client():
    return Github(os.getenv("GITHUB_TOKEN"))


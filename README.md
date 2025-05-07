# GitSum (Work in Progress)

GitSum is a web application that integrates with GitHub OAuth to provide repository insights, commit analysis, and AI-powered chat about your codebase. This project is currently a work in progress.

## Overview

GitSum allows users to authenticate with GitHub, import repositories, and interact with their codebase using AI. The backend is built with FastAPI and the frontend uses React with Vite.

## Features

- GitHub OAuth authentication
- Import and analyze repositories
- AI-powered chat about commits and code
- User session management
- Responsive UI with TailwindCSS

## Tech Stack

- **Frontend:** React, Vite, TypeScript, TailwindCSS, Axios
- **Backend:** FastAPI, SQLAlchemy, Python, OpenAI API
- **Database:** (Configured via SQLAlchemy, see backend setup)

## Setup

### Prerequisites
- Node.js & npm
- Python 3.8+
- GitHub OAuth App credentials
- OpenAI API key

### Frontend
```bash
cd frontend
cp .env.example .env # Create and fill in your environment variables
npm install
npm run dev
```

### Backend
```bash
cd backend
cp .env.example .env # Create and fill in your environment variables
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.api:app --reload
```

## Contributing

This project is a work in progress. Contributions, bug reports, and feature requests are welcome! Please open an issue or submit a pull request.

---

**Note:** This project is under active development and not all features are complete or stable yet.

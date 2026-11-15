
# Customer Support Intelligence Platform

An AI-powered customer support management and ticket intelligence platform built using React, FastAPI, PostgreSQL, and Python.

## Project Overview

The platform helps support teams manage customer tickets, analyze customer issues, prioritize requests, and generate AI-powered insights.

## Technology Stack

### Frontend
- React.js
- Vite
- Material UI (MUI)
- React Router
- TanStack Query
- Axios

### Backend
- Python
- FastAPI
- SQLAlchemy
- Pydantic
- Alembic

### Database
- PostgreSQL

### AI Integration
- OpenAI API
- NLP-based ticket classification
- AI-powered ticket analysis and insights

### Testing
- Pytest
- HTTPX

## Project Structure

```text
customer-support-intelligence-platform/
├── frontend/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── db/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── repositories/
│   │   ├── services/
│   │   ├── middleware/
│   │   └── utils/
│   ├── tests/
│   ├── alembic/
│   └── requirements.txt
├── dataset/
├── docs/
├── scripts/
└── .github/
    └── copilot-instructions.md
```

## Main Features

- Customer support ticket management
- Ticket creation, updating, and deletion
- Ticket categorization and prioritization
- Dashboard with ticket statistics
- Search and filtering
- AI-powered ticket classification
- AI-generated ticket analysis
- Customer support insights and analytics

## Getting Started

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

Backend server startup instructions will be added after backend configuration.

## Database

PostgreSQL is used as the primary relational database.

Database configuration will be managed through environment variables.

## Project Status

Frontend foundation: Completed.

Backend foundation: In progress.

Database integration: Pending.

AI integration: Pending.

## License

This project is developed for educational and portfolio purposes.

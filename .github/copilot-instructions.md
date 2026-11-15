
# GitHub Copilot Instructions
# Customer Support Intelligence Platform

## 1. Project Overview

This project is an AI-powered Customer Support Intelligence Platform.

The goal is to build a full-stack application that helps support teams manage customer tickets, classify customer issues, prioritize requests, analyze ticket content, and generate useful business insights using AI.

The application consists of:
- React frontend
- Python FastAPI backend
- PostgreSQL database
- SQLAlchemy ORM
- OpenAI API for AI-powered analysis

Always understand the existing project structure before generating or modifying code.

## 2. Technology Stack

### Frontend
- React.js
- Vite
- JavaScript (JSX)
- Material UI (MUI)
- React Router DOM
- TanStack Query
- Axios
- React Hook Form
- Zod

### Backend
- Python
- FastAPI
- SQLAlchemy
- Pydantic
- Alembic
- Uvicorn

### Database
- PostgreSQL
- Psycopg 3
- SQLAlchemy ORM

### AI
- OpenAI API
- Python-based AI service layer
- Structured AI responses
- Ticket classification and analysis

### Testing
- Pytest
- HTTPX
- Frontend ESLint

## 3. Architecture Principles

Follow clean architecture and separation of concerns.

Backend request flow:

API Endpoint
    -> Service
        -> Repository
            -> Database

Responsibilities:

- Endpoints: Handle HTTP requests and responses.
- Services: Implement business logic.
- Repositories: Handle database queries.
- Models: Define SQLAlchemy database models.
- Schemas: Define Pydantic request and response schemas.
- Core: Application configuration and security.
- DB: Database connection and session management.
- Middleware: Request processing and cross-cutting concerns.
- Utils: Reusable helper functions.

Never put database queries directly inside API endpoints.

Never put business logic inside database models.

Keep AI-related functionality inside the services/ai directory.

## 4. Frontend Architecture

Follow feature-based folder organization.

frontend/src/
    components/
        common/
        layout/
        ui/
    features/
        dashboard/
        tickets/
        ai-analysis/
    providers/
    routes/
    services/
    hooks/
    theme/
    types/
    utils/

Rules:

- Keep reusable components inside components.
- Keep feature-specific components inside their respective features.
- Keep API calls inside service files.
- Use TanStack Query for server-state management.
- Use React Router for navigation.
- Use Material UI for consistent UI components.
- Use React Hook Form and Zod for form handling and validation.
- Keep components focused and reusable.
- Avoid unnecessarily large components.
- Do not duplicate API logic across components.
- Use centralized API configuration with Axios.

## 5. Backend Coding Standards

- Use Python type hints.
- Use async endpoints where appropriate.
- Use Pydantic schemas for validation.
- Use SQLAlchemy for database operations.
- Use dependency injection for database sessions.
- Keep business logic inside service classes or service functions.
- Use HTTPException or centralized exception handling appropriately.
- Return consistent API responses.
- Avoid unnecessary global state.
- Follow PEP 8 naming conventions.
- Use descriptive variable and function names.

## 6. Database Standards

Use PostgreSQL as the primary database.

Use SQLAlchemy ORM for database interactions.

Rules:

- Define models with explicit column types.
- Use primary keys and foreign keys appropriately.
- Add timestamps where useful.
- Add indexes for frequently queried fields when justified.
- Use Alembic for database migrations.
- Never modify production database structure manually.
- Avoid duplicate database queries.
- Use transactions when multiple related database operations must succeed together.
- Never hardcode database credentials.

## 7. Ticket Management Domain

The platform manages customer support tickets.

Ticket functionality includes:

- Create tickets.
- Retrieve tickets.
- Update tickets.
- Delete tickets.
- Search tickets.
- Filter tickets.
- Track ticket status.
- Categorize tickets.
- Assign priority.

Ticket attributes should be designed around the actual dataset and business requirements.

Potential attributes include:

- Ticket ID
- Customer name
- Subject/title
- Description
- Category
- Priority
- Status
- Created timestamp
- Updated timestamp

Do not assume every field is mandatory. Confirm the database schema and dataset before implementing.

## 8. AI Integration Standards

AI functionality must be isolated inside:

backend/app/services/ai/

Potential AI features:

- Automatic ticket classification.
- Ticket priority recommendation.
- Ticket sentiment analysis.
- Ticket summarization.
- AI-generated ticket explanations.
- Support trend analysis.
- Customer support insights.

Rules:

- Keep OpenAI API calls outside API endpoints.
- Use environment variables for API keys.
- Never expose API keys to the frontend.
- Handle API failures and timeouts.
- Validate AI responses before using them.
- Do not blindly trust AI-generated output.
- Avoid unnecessary API calls.
- Keep deterministic business rules separate from AI-generated recommendations.
- Do not fabricate AI results.

## 9. API Design Standards

Use RESTful API conventions.

Use versioned API routes:

/api/v1/

Organize endpoints by feature.

Examples:

GET    /api/v1/tickets
GET    /api/v1/tickets/{ticket_id}
POST   /api/v1/tickets
PUT    /api/v1/tickets/{ticket_id}
DELETE /api/v1/tickets/{ticket_id}

Use appropriate HTTP status codes.

Validate request data using Pydantic.

Use consistent error responses.

Generate and maintain API documentation through FastAPI OpenAPI support.

## 10. Environment Configuration

Use environment variables for:

- Database connection URL.
- OpenAI API key.
- Application environment.
- Secret keys.
- Other sensitive configuration.

Use Pydantic Settings for backend configuration.

Maintain an .env.example file.

Never commit actual .env files or credentials.

## 11. Testing Standards

Backend:
- Write tests using Pytest.
- Use HTTPX for API testing.
- Test successful and unsuccessful requests.
- Test validation and error handling.
- Test service and repository logic.

Frontend:
- Run ESLint.
- Verify application functionality after changes.
- Avoid introducing console errors.

Do not claim tests pass unless they have actually been executed.

## 12. Git Standards

Use meaningful commit messages.

Examples:

feat: add ticket management APIs
feat: implement AI ticket classification
fix: resolve ticket filtering issue
refactor: improve ticket service architecture
docs: update project documentation

Never commit:
- .env files
- API keys
- Database passwords
- node_modules
- Python virtual environments
- Build artifacts

## 13. Copilot Working Rules

Before generating code:

1. Inspect the existing folder structure.
2. Read related files.
3. Understand existing naming conventions.
4. Check dependencies already installed.
5. Follow the established architecture.
6. Avoid creating duplicate files.
7. Avoid unnecessary dependencies.
8. Explain important implementation decisions.

When implementing a feature:

1. Explain what we are building.
2. Identify the files that need to be created or modified.
3. Implement the functionality.
4. Explain the code in simple terms.
5. Provide commands to run and test it.
6. Mention any required environment variables or database migrations.

Do not modify unrelated files.

Do not generate the entire application in one step.

Implement functionality incrementally and maintainable.

If a requirement is unclear, ask before making major architectural decisions.

## 14. Learning and Explanation Requirements

The developer is learning Python, FastAPI, PostgreSQL, SQLAlchemy, and AI integration.

When generating backend code:

- Explain Python syntax when relevant.
- Explain FastAPI concepts.
- Explain database relationships.
- Explain SQLAlchemy queries.
- Explain how API requests reach the database.
- Explain why a particular architecture is used.
- Provide practical examples.

Keep explanations beginner-friendly without compromising professional coding standards.

## 15. Important Project Rule

This is a learning and portfolio project intended to demonstrate real-world full-stack development skills.

Prioritize:

- Clean architecture.
- Maintainable code.
- Proper database design.
- Secure API development.
- Practical AI integration.
- Good frontend experience.
- Proper error handling.
- Testing.
- Production-ready development practices.

Always build on the existing project rather than replacing working implementations.

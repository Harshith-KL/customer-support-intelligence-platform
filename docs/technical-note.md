# Technical note

## Technology and design choices

- **React and Material UI** provide the responsive user interface. Feature pages and reusable ticket components are separated from the Axios service layer.
- **TanStack Query** manages API-backed ticket state and cache invalidation after mutations.
- **FastAPI and Pydantic** provide REST routes, request validation, response schemas, and generated OpenAPI documentation.
- **SQLAlchemy and PostgreSQL** persist tickets and AI analysis history. Alembic owns schema changes.
- The backend follows route → service → repository → ORM/database for ticket CRUD and analysis persistence. Provider-specific calls are isolated in `services/ai/openrouter_service.py`.

## AI integration and human review

The backend calls OpenRouter through the OpenAI-compatible Chat Completions API. The model and API key are configured on the backend (`OPENROUTER_MODEL`, `OPENROUTER_API_KEY`); the frontend never receives the key. `openrouter/free` is the current default.

The service requests a JSON object and validates category, priority, summary, and reason with the existing Pydantic schema. It uses bounded retries for rate limits and transient provider errors, with backoff and `Retry-After` handling. Authentication/provider failures and malformed responses return errors rather than mock or fabricated analysis. Analysis history is written only after a valid response.

Generating an analysis does not modify the ticket. A separate human-triggered acceptance endpoint applies only the saved category and priority recommendation. The summary and reason remain in analysis history.

The review UI keeps the original AI category/priority visible and lets the user choose final values before acceptance. The API validates those values, updates the ticket only after explicit acceptance, and leaves the original recommendation fields in analysis history unchanged. The current model does not record an accepted flag/timestamp or the final override on the analysis row; the accepted values are persisted on the ticket, and no acceptance timestamp is fabricated.

## Dataset labels and handling

The included `customer_support_tickets_sample_150.csv` has 150 rows and these 10 columns:

`ticket_id`, `customer_id`, `subject`, `description`, `created_at`, `status`, `category`, `priority`, `sentiment`, `resolution`.

The assignment text mentions `expected_category` and `expected_priority`, but those columns are not present in the supplied CSV. The import endpoint expects the 10 columns above and rejects unexpected/missing headers. It upserts by ticket ID; it does not copy AI labels from reference columns.

The dataset's categories are `Account`, `Billing`, `Delivery`, `Technical`, `Other`, and `Product`. The application UI and AI response schema use those same values. The assignment's category list differs:

| Assignment label | Current application/data handling |
|---|---|
| `Billing` | Exact value `Billing` is retained. |
| `Technical Issue` | Corresponds conceptually to the application's `Technical`; no stored-label rewrite is performed. |
| `Account Access` | Corresponds conceptually to `Account`; no stored-label rewrite is performed. |
| `Feature Request` | The application has no separate value. Feature requests may be classified as `Product`, which also covers other product issues; this is not a one-to-one mapping. |
| `General Enquiry` | The application uses `Other` as its fallback category; this is not a guaranteed semantic equivalence. |
| Dataset-only `Delivery` | Retained as `Delivery`; the assignment category list has no direct equivalent. |

No category normalization or database rewrite is performed. Ticket category/priority/status fields are database strings; the frontend supplies its supported choices, while the AI result schema validates AI recommendations against the six current application categories and four priority values.

The supplied dataset has statuses `Open`, `In Progress`, `Resolved`, and `Closed` (29 of 150 rows are `Closed`). The assignment lists only the first three. The application preserves `Closed`, includes it in the total ticket count, and shows separate dashboard counts for Open, In Progress, and Resolved. Priorities (`Low`, `Medium`, `High`, `Critical`) match the assignment.

The assignment calls for a customer name, but the supplied data/model use `customer_id`; the application displays and stores that identifier rather than deriving a customer name.

## Error handling and security

- Request data is validated at API boundaries; missing tickets return 404 and invalid payloads return validation errors.
- OpenRouter credentials are read from backend environment configuration and are not logged or sent to the browser.
- Ticket text is sent as untrusted input to the provider and is not treated as instructions. The model is asked only for recommendations and cannot update the database.
- Provider outages, rate limits, invalid credentials/configuration, and malformed responses are surfaced as API errors; no fake analysis is substituted.
- The project is intended for local assignment evaluation. It does not implement authentication/authorization, per-user access control, production secret management, or production deployment.

## Testing status and known limitations

- Backend tests use Pytest/HTTPX and mock OpenRouter requests. The database integration tests require the configured PostgreSQL database to be available.
- Frontend tests cover ticket form validation and successful submission using React Testing Library. They are component tests, not browser end-to-end or live API integration tests.
- Dashboard statistics are calculated in the frontend from paginated ticket data, so the client fetches all pages to calculate totals; a server-side aggregate endpoint would scale better for much larger datasets.
- Several analysis columns (`sentiment`, `suggested_response`, and `confidence_score`) are nullable and are not currently populated by the active OpenRouter flow.
- OpenRouter's free model router may have variable availability, rate limits, or model behavior.
- No screenshots or demo video are included in this repository yet; see the capture checklist in the [README](../README.md#screenshots-and-demo).

## Future improvements

1. Define and approve an explicit category/status migration policy before changing legacy dataset values or existing records.
2. Allow users to edit pending AI category/priority recommendations and record acceptance metadata.
3. Move dashboard aggregation to a paginated/statistics API for larger datasets.
4. Add browser-level end-to-end tests for ticket creation, filtering, analysis review, and acceptance.
5. Add AI quality evaluation using a separately approved labeled dataset; the supplied CSV contains no expected-label columns.

## AI coding-tool disclosure

GitHub Copilot assisted with code inspection, documentation, and test authoring. The project owner remains responsible for reviewing the changes and explaining the design during the technical discussion.


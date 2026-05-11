# Candidate Management System

An AI-powered candidate management system built with FastAPI and React.

### Quick Start (Full System with Docker)

1. Ensure you have Docker and Docker Compose installed.
2. Configure your `.env` in the `backend` directory.

3. Start the entire system using **yarn dev** in Docker:
   ```bash
   docker compose up --build
   ```
   The frontend will be available at `http://localhost:5173` and the API at `http://localhost:8000`. Changes you make to the code will reflect in real-time.

### Manual Development Setup

If you prefer to run services manually:

#### Backend Setup

1. Navigate to the `backend` directory.
2. Start the API:
   ```bash
   docker compose up api --build
   ```

#### Frontend Setup

1. Navigate to the `frontend` directory.
2. Install dependencies and run:
   ```bash
   yarn
   yarn dev
   ```

---

## Credentials & Environment Variables

-`Groq API Key`: `YOUR_GROQ_API_KEY_HERE`

### Configuration Details:

- `DATABASE_URL`: `sqlite:///./sql_app.db`
- `SECRET_KEY`: `your-secret-key-for-dev`
- `ALGORITHM`: `HS256`
- `ALLOWED_ORIGINS`: `http://localhost:5173`

## Architectural Decision Records (ADR)

### 1. Database Choice: SQLite

Use SQLite as the primary and light database.
SQLite provides a zero-configuration, file-based database that is ideal for rapid development and demonstration. It avoids the overhead of managing a separate database container while still supporting SQL-based relations.

### 4. JWT Authentication & Token Blacklisting

**Decision**: Implement JWT authentication with access and refresh tokens. Use a database-backed blacklist for tokens upon logout.
**Rationale**: Refresh tokens provide a better user experience by allowing longer sessions without re-login, while maintaining security. Blacklisting ensures that logged-out tokens cannot be reused, mitigating the risk of stolen tokens.

### 2. Deletion Strategy: Soft Delete (Archive)

Implement "Soft Delete" by changing candidate status to `archived` instead of hard-deleting records.
Preserving candidate data is crucial for historical auditing and maintaining the integrity of related scores and logs. This approach allows for data recovery and better analytics.

### 3. AI SDK: Groq for Llama 3

Integrate the Groq SDK for AI-powered candidate summarization.
Groq offers exceptionally low latency for large language models. Using the Llama 3 model provides high-quality summaries while keeping the system responsive.

---

## API Examples (CURL)

### 1. Register User

```bash
curl -X POST http://localhost:8000/api/register \
     -H "Content-Type: application/json" \
     -d '{"email": "newuser@test.com", "password": "yourpassword", "role": "reviewer"}'
```

### 2. Login (Obtain Tokens)

```bash
curl -X POST http://localhost:8000/api/login \
     -H "Content-Type: application/json" \
     -d '{"email": "admin@test.com", "password": "yourpassword"}'
```

### 3. Refresh Token

```bash
curl -X POST http://localhost:8000/api/refresh \
     -H "Content-Type: application/json" \
     -d '{"refresh_token": "YOUR_REFRESH_TOKEN"}'
```

### 4. Logout (Blacklist Tokens)

```bash
curl -X POST http://localhost:8000/api/logout \
     -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"access_token": "YOUR_ACCESS_TOKEN", "refresh_token": "YOUR_REFRESH_TOKEN"}'
```

### 5. Search Candidates (Optimized with Debouncing)

The search functionality is optimized using "frontend debouncing" (500ms) to reduce the number of API calls during user input.

```bash
curl -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
     "http://localhost:8000/api/candidates/?search=John&limit=5"
```

### 6. Get Candidates (Paginated)

```bash
curl -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
     http://localhost:8000/api/candidates/?limit=5&skip=0
```

### 7. Archive (Soft-Delete) Candidate

```bash
curl -X DELETE -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
     http://localhost:8000/api/candidates/1
```

### 8. Generate AI Summary

```bash
curl -X POST -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"style": "concise"}' \
     http://localhost:8000/api/candidates/1/summary
```

### 9. Streaming Score Updates (Real-time)

To enable real-time streaming of scores and updates, ensure that the **Stream Score** page is open in a separate tab. This establishes the necessary WebSocket/SSE connection to receive live updates.

```bash
curl -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
     http://localhost:8000/api/candidates/1/stream
```

---

## Testing

To run the API tests:

```bash
cd backend
python3 -m pytest tests/test_api.py
```

### Debugging

All the data is being fetched at once and is loaded in python list. The concept of pagination is to save bandwidth, instead of fetching all the data at once.

The solution can be like:
page_size = 10
offset = 20
query = "SELECT \* FROM products ORDER BY id LIMIT 10 OFFSET 20" its lazy, database is not hit here.
db.execute(query, (page_size, offset)) << Database is hit at this time.

### Learnings

Worked with FastAPI and Pydantic for the first time.
-FastAPI
-Pydantic
-How to secure APIs using FastAPI.
-Making schemas for API inputs and outputs.
-Sqllite is not a server database. It is a file based database.

No migrations needed, simple and easy.

Defining relations between tables in SQLALchemy is just like defining relationships in Django ORM.
related_name in Django ORM is same as in SQLALchemy.

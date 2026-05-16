from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
import os
from dotenv import load_dotenv

load_dotenv()
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")

# Ensure the data directory exists for SQLite
if SQLALCHEMY_DATABASE_URL.startswith("sqlite"):
    # Extract directory from the URL (e.g., sqlite:///./data/sql_app.db -> ./data)
    db_path = SQLALCHEMY_DATABASE_URL.replace("sqlite:///", "")
    db_dir = os.path.dirname(db_path)
    if db_dir and not os.path.exists(db_dir):
        os.makedirs(db_dir, exist_ok=True)

if SQLALCHEMY_DATABASE_URL.startswith("sqlite"):
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL,
        connect_args={"check_same_thread": False},
        # connect_args = {"check_same_thread": False}
        # “Allow this SQLite connection to be accessed from different threads.”
        # Without it, many FastAPI + SQLite tutorials fail during requests.
        # SQLite orginally assumes only one thread uses the database connection.
        # Problem it solves:
        # SQLite has this rule:
        # A connection can only be used in the thread where it was created.
        # But FastAPI runs like this:
        # multiple requests
        # multiple threads / async workers
        # Error: SQLite objects created in a thread can only be used in that same thread
        # So FastAPI won’t crash when handling concurrent requests.
    )
else:
    engine = create_engine(SQLALCHEMY_DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
# This is the factory that creats database sessions.
# SessionLocal = session generator
# “Should SQLAlchemy automatically flush pending changes before running a query?”


# autocommit: Controls wheater SQLAlchemy automatically saves changes.
# Changes are saved immediately without commit().
# sessionmaker(...)
# This creats a configured session factory.You are telling SQLAlchemy, whenever i create session, use this rules.


# PARAMETERS
# bind: Without this, session won’t know where the DB is

# bind=engine; This connects the session to the datbase engine.

# So autoflush controls whether SQLAlchemy automatically pushes your half-prepared work to the database just because you asked a question.


class Base(DeclarativeBase):
    pass


def get_db():
    print("GETTING DB SESSION")
    db = SessionLocal()
    try:
        yield db
        # yield db is like:
        # “Here is the database session — use it, and I’ll take it back and close it when you’re done.”

        # yield db Analogy
        # It’s like the librarian saying:
        # “Here is the book. You can use it while you’re inside the library.”
    finally:
        db.close()

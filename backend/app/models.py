from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean,
    Text,
    DateTime,
    ForeignKey,
    Enum,
    CheckConstraint,
)
from sqlalchemy.orm import relationship
from datetime import datetime

import enum


class CandidateStatus(str, enum.Enum):
    NEW = "new"
    REVIEWED = "reviewed"
    HIRED = "hired"
    REJECTED = "rejected"
    ARCHIVED = "archived"


class ApplicantRole(str, enum.Enum):
    SOFTWARE_ENGINEER = "software_engineer"
    FRONT_END = "front_end"
    BACK_END = "back_end"
    PROJECT_MANAGER = "project_manager"


class UserRole(str, enum.Enum):
    REVIEWER = "reviewer"
    ADMIN = "admin"


from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    # id = Column(Integer, primary_key=True)
    # PRIMARY KEY ⇒ indexed automatically (SQLite included)
    # SQLite:

    # makes it the row identifier
    # creates a B-tree index automatically
    # enforces uniqueness

    email = Column(String, unique=True, index=True, nullable=False)
    # When there is uniquie = True, index is not required, It creates uniquie indexing in db, So its redundate to index seperately when there is already assigned as unique

    hashed_password = Column(String, nullable=False)
    role = Column(String, nullable=False, index=True, default="reviewer")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class Candidate(Base):
    __tablename__ = "candidates"

    id = Column(Integer, primary_key=True, index=True)
    # id = Column(Integer, primary_key=True)
    # PRIMARY KEY ⇒ indexed automatically (SQLite included)
    # SQLite:

    # makes it the row identifier
    # creates a B-tree index automatically
    # enforces uniqueness
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    role_applied = Column(
        Enum(ApplicantRole, native_enum=False), nullable=False, index=True
    )
    status = Column(String, default=CandidateStatus.NEW, index=True)
    skills = Column(Text, nullable=True)
    internal_notes = Column(Text, nullable=True)
    ai_summary = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    reviewer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    # reviewer_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    # Because you will almost always query:
    # WHERE reviewer_id = ?
    # Or
    # JOIN users ON candidates.reviewer_id = users.id

    scores = relationship(
        "Score", back_populates="candidate", cascade="all, delete-orphan"
    )


class Score(Base):
    __tablename__ = "scores"

    id = Column(Integer, primary_key=True, index=True)
    # id = Column(Integer, primary_key=True)
    # PRIMARY KEY ⇒ indexed automatically (SQLite included)
    # SQLite:

    # makes it the row identifier
    # creates a B-tree index automatically
    # enforces uniqueness
    candidate_id = Column(Integer, ForeignKey("candidates.id"))
    category = Column(String)
    score = Column(Integer, index=True)
    reviewer_id = Column(Integer, ForeignKey("users.id"))
    note = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    candidate = relationship("Candidate", back_populates="scores")

    __table_args__ = (
        CheckConstraint("score>=1 AND score <=5", name="score_range_check"),
    )


class BlacklistedToken(Base):
    __tablename__ = "blacklisted_tokens"

    id = Column(Integer, primary_key=True, index=True)
    # id = Column(Integer, primary_key=True)
    # PRIMARY KEY ⇒ indexed automatically (SQLite included)
    # SQLite:

    # makes it the row identifier
    # creates a B-tree index automatically
    # enforces uniqueness
    token = Column(String, unique=True, index=True, nullable=False)
    # When there is uniquie = True, index is not required, It creates uniquie indexing in db, So its redundate to index seperately when there is already assigned as unique
    blacklisted_on = Column(DateTime, default=datetime.utcnow)

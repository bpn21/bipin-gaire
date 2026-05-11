from pydantic import BaseModel, EmailStr, ConfigDict, Field, field_validator
from typing import Optional, List
from datetime import datetime
from .models import ApplicantRole, CandidateStatus

class CandidateBase(BaseModel):
    name: str
    email: EmailStr
    role_applied: ApplicantRole
    status: CandidateStatus = CandidateStatus.NEW
    skills: Optional[str] = None
    internal_notes: Optional[str] = None

    @field_validator('role_applied', 'status', mode='before')
    @classmethod
    def lowercase_string(cls, v):
        if isinstance(v, str):
            return v.lower()
        return v

class CandidateCreate(CandidateBase):
    initial_score: Optional[int] = Field(None, ge=1, le=5)


class CandidateUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    role_applied: Optional[ApplicantRole] = None
    status: Optional[CandidateStatus] = None
    skills: Optional[str] = None
    internal_notes: Optional[str] = None

    
class ScoreBase(BaseModel):
    category: str
    score: int = Field(..., ge=1, le=5)
    note: Optional[str] = None

class ScoreCreate(ScoreBase):
    pass

class CandidateMinimal(CandidateBase):
    id: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class Score(ScoreBase):
    id: int
    candidate_id: int
    reviewer_id: int
    created_at: datetime
    candidate: Optional[CandidateMinimal] = None

    model_config = ConfigDict(from_attributes=True)


class Candidate(CandidateBase):
    id: int
    created_at: datetime
    scores: List[Score] = []

    model_config = ConfigDict(from_attributes=True)

class CandidateList(CandidateBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class CandidatePagination(BaseModel):
    total: int
    skip: int
    limit: int
    items: List[CandidateList]


class CandidateSummary(BaseModel):
    summary: str

class UserBase(BaseModel):
    email: EmailStr

class UserLogin(BaseModel):
    email: Optional[EmailStr] = None
    password: Optional[str] = None

class UserCreate(BaseModel):
    email: Optional[str] = None
    password: Optional[str] = None
    role: Optional[str] = "reviewer"

class User(UserBase):
    id: int
    is_active: bool
    role: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
    

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str

class TokenRefresh(BaseModel):
    refresh_token: str

class TokenData(BaseModel):
    email: Optional[str] = None

class LogoutRequest(BaseModel):
    access_token: str
    refresh_token: str

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app import schemas, models, auth
from app.services import candidate_service
from app.database import get_db
from fastapi.responses import StreamingResponse
from fastapi import WebSocket, WebSocketDisconnect
from app.websocket_manager import manager
import asyncio
import json

router = APIRouter(
    prefix="/candidates",
    tags=["candidates"]
)

@router.post("/", response_model=schemas.Candidate, status_code=status.HTTP_201_CREATED)
def create_candidate(
    candidate: schemas.CandidateCreate, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    return candidate_service.create_candidate(db=db, candidate=candidate, reviewer_id=current_user.id)


@router.get("/", response_model=schemas.CandidatePagination)
def read_candidates(
    skip: int = 0, 
    limit: int = 20, 
    search: str = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    limit = min(limit, 50)
    items, total = candidate_service.get_candidates(db, user=current_user, skip=skip, limit=limit, search=search)
    return {
        "total": total,
        "skip": skip,
        "limit": limit,
        "items": items
    }

@router.get("/{id}", response_model=schemas.Candidate)
def read_candidate(
    id: int, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    db_candidate = candidate_service.get_candidate(db, candidate_id=id, user=current_user)
    if db_candidate is None:
        raise HTTPException(status_code=404, detail="Candidate not found")
    return db_candidate

@router.patch("/{id}", response_model=schemas.Candidate)
def update_candidate(
    id: int, 
    candidate: schemas.CandidateUpdate, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    db_candidate = candidate_service.update_candidate(db, candidate_id=id, candidate_update=candidate, user=current_user)
    if db_candidate is None:
        raise HTTPException(status_code=404, detail="Candidate not found")
    return db_candidate


@router.delete("/{candidate_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_candidate(
    candidate_id: int, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    success = candidate_service.delete_candidate(db, candidate_id=candidate_id, user=current_user)
    if not success:
        raise HTTPException(status_code=404, detail="Candidate not found")
    return None

@router.post("/{id}/scores", response_model=schemas.Score)
def add_candidate_score(
    id: int, 
    score: schemas.ScoreCreate, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    return candidate_service.add_score(db=db, candidate_id=id, score=score, reviewer_id=current_user.id)

@router.get("/{id}/scores", response_model=List[schemas.Score])
def get_candidate_scores(
    id: int, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    return candidate_service.get_scores(db=db, candidate_id=id, user=current_user)


@router.post("/{id}/summary", response_model=schemas.Candidate)
def update_candidate_summary(
    id: int, 
    summary_data: schemas.CandidateSummary, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    db_candidate = candidate_service.update_summary(db=db, candidate_id=id, summary=summary_data.summary, user=current_user)
    if db_candidate is None:
        raise HTTPException(status_code=404, detail="Candidate not found")
    return db_candidate



@router.get("/{id}/stream")
async def stream_candidate_updates(
    id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    async def event_generator():
        while True:
            await asyncio.sleep(5)
            yield f"data: {json.dumps({'event': 'heartbeat', 'candidate_id': id})}\n\n"
    
    return StreamingResponse(event_generator(), media_type="text/event-stream")

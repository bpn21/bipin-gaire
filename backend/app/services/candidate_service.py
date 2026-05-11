from sqlalchemy.orm import Session, joinedload
from app import models, schemas
from app.websocket_manager import manager
import asyncio
import logging

logger = logging.getLogger(__name__)

def get_candidate(db: Session, candidate_id: int, user: models.User):
    # query = db.query(models.Candidate).filter(models.Candidate.id == candidate_id)
    query = db.query(models.Candidate).options(joinedload(models.Candidate.scores)).filter(models.Candidate.id == candidate_id)
    if user.role != "admin":
        query = query.filter(models.Candidate.reviewer_id == user.id)
    return query.first()

def get_candidates(db: Session, user: models.User, skip: int = 0, limit: int = 20, search: str = None):
    query = db.query(models.Candidate)
    # query = db.query(models.Candidate).options(joinedload(models.Candidate.scores))
    if user.role != "admin":
        query = query.filter(models.Candidate.reviewer_id == user.id)
    
    if search:
        query = query.filter(
            (models.Candidate.name.ilike(f"%{search}%")) |
            (models.Candidate.email.ilike(f"%{search}%"))
        )
    
    total = query.count()
    items = query.offset(skip).limit(limit).all()
    return items, total

def get_scores(db: Session, candidate_id: int, user: models.User):
    query = db.query(models.Score).filter(models.Score.candidate_id == candidate_id)
    query = db.query(models.Score).options(joinedload(models.Score.candidate)).filter(models.Score.candidate_id == candidate_id)
    if user.role != "admin":
        query = query.filter(models.Score.reviewer_id == user.id)
    return query.all()

def notify_score_update(db: Session, candidate_id: int, reviewer_id: int, score: int, category: str):
    candidate = db.query(models.Candidate).filter(models.Candidate.id == candidate_id).first()
    reviewer = db.query(models.User).filter(models.User.id == reviewer_id).first()
    
    if candidate and reviewer:
        payload = {
            "type": "score_update",
            "reviewer_name": reviewer.email,
            "candidate_name": candidate.name,
            "score": score,
            "category": category
        }
        
        logger.info(f"WS BROADCAST: Candidate {candidate.name}, Score {score}. Active Conns: {len(manager.active_connections)}")
        
        try:
            if manager.loop and manager.loop.is_running():
                asyncio.run_coroutine_threadsafe(manager.broadcast(payload), manager.loop)
                logger.info("WS BROADCAST: Task scheduled")
            else:
                logger.error("WS BROADCAST: Loop not running")
        except Exception as e:
            logger.error(f"WS BROADCAST: Error: {e}")
    else:
        logger.error(f"WS BROADCAST: Records not found (Cand: {candidate_id}, Rev: {reviewer_id})")

def create_candidate(db: Session, candidate: schemas.CandidateCreate, reviewer_id: int):
    candidate_data = candidate.model_dump()
    initial_score = candidate_data.pop("initial_score", None)
    
    db_candidate = models.Candidate(**candidate_data, reviewer_id=reviewer_id)
    db.add(db_candidate)
    db.commit()
    db.refresh(db_candidate)
    
    if initial_score is not None:
        db_score = models.Score(
            candidate_id=db_candidate.id,
            category=db_candidate.role_applied,
            score=initial_score,
            reviewer_id=reviewer_id,
            note="Initial score during registration"
        )
        db.add(db_score)
        db.commit()
        notify_score_update(db, db_candidate.id, reviewer_id, initial_score, str(db_candidate.role_applied))
        
    return db_candidate

def update_candidate(db: Session, candidate_id: int, candidate_update: schemas.CandidateUpdate, user: models.User):
    db_candidate = get_candidate(db, candidate_id, user)
    if db_candidate:
        update_data = candidate_update.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_candidate, key, value)
        db.commit()
        db.refresh(db_candidate)
    return db_candidate

def delete_candidate(db: Session, candidate_id: int, user: models.User):
    db_candidate = get_candidate(db, candidate_id, user)
    if db_candidate:
        db.delete(db_candidate)
        db.commit()
        return True
    return False

def add_score(db: Session, candidate_id: int, score: schemas.ScoreCreate, reviewer_id: int):
    existing_score = db.query(models.Score).filter(
        models.Score.candidate_id == candidate_id,
        models.Score.category == score.category,
        models.Score.reviewer_id == reviewer_id
    ).first()
    
    if existing_score:
        for key, value in score.model_dump().items():
            setattr(existing_score, key, value)
        db.commit()
        db.refresh(existing_score)
        notify_score_update(db, candidate_id, reviewer_id, score.score, score.category)
        return existing_score
    
    db_score = models.Score(**score.model_dump(), candidate_id=candidate_id, reviewer_id=reviewer_id)
    db.add(db_score)
    db.commit()
    db.refresh(db_score)
    notify_score_update(db, candidate_id, reviewer_id, score.score, score.category)
    return db_score

def update_summary(db: Session, candidate_id: int, summary: str, user: models.User):
    db_candidate = get_candidate(db, candidate_id, user)
    if db_candidate:
        db_candidate.internal_notes = summary 
        db.commit()
        db.refresh(db_candidate)
    return db_candidate

from fastapi import APIRouter, Depends, HTTPException, status, Body
from sqlalchemy.orm import Session
from datetime import timedelta
from app import schemas, models, auth, database
import logging

logger = logging.getLogger(__name__)

router = APIRouter(
    tags=["authentication"]
)

@router.post("/login", response_model=schemas.Token)
async def login(
    data: schemas.UserLogin = Body(None),
    db: Session = Depends(database.get_db)
):
    if not data or not data.email or not data.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    user = db.query(models.User).filter(models.User.email == data.email).first()
    if not user or not auth.verify_password(data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = auth.create_access_token(data={"sub": user.email})
    refresh_token = auth.create_refresh_token(data={"sub": user.email})
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }

@router.post("/refresh", response_model=schemas.Token)
async def refresh_token(
    refresh_data: schemas.TokenRefresh,
    db: Session = Depends(database.get_db)
):
    payload = auth.decode_access_token(refresh_data.refresh_token)
    if not payload or payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    email = payload.get("sub")
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    new_access_token = auth.create_access_token(data={"sub": user.email})
    new_refresh_token = auth.create_refresh_token(data={"sub": user.email})
    
    return {
        "access_token": new_access_token,
        "refresh_token": new_refresh_token,
        "token_type": "bearer"
    }


@router.post("/register", response_model=schemas.User)
async def register_user(
    data: schemas.UserCreate = Body(None), 
    db: Session = Depends(database.get_db)
):
    print('REGISTER ATTEMPT:', data, flush=True)
    logger.info(f"REGISTER ATTEMPT: {data}")
    
    if not data or not data.email or not data.password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Email and password are required"
        )
    
    db_user = db.query(models.User).filter(models.User.email == data.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = auth.get_password_hash(data.password)
    new_user = models.User(
        email=data.email,
        hashed_password=hashed_password, 
        role=data.role or "reviewer"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.get("/whoami", response_model=schemas.User)
async def whoami(current_user: models.User = Depends(auth.get_current_user)):
    return current_user

@router.post("/logout")
async def logout(
    data: schemas.LogoutRequest,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    if data.access_token:
        access_token_blacklist = models.BlacklistedToken(token=data.access_token)
        db.add(access_token_blacklist)
    
    if data.refresh_token:
        refresh_token_blacklist = models.BlacklistedToken(token=data.refresh_token)
        db.add(refresh_token_blacklist)
        
    db.commit()
    return {"detail": "Successfully logged out"}
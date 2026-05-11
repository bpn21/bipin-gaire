import logging
import sys
import os
from fastapi import FastAPI, Depends, Request, APIRouter
from .database import engine, Base
from .routers import candidates, auth
from .auth import get_current_user
import uvicorn
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from app.websocket_manager import manager
from fastapi import WebSocket, WebSocketDisconnect
import asyncio

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    handlers=[
        logging.StreamHandler(sys.stdout),
        logging.FileHandler("app.log")
    ]
)
logger = logging.getLogger(__name__)

Base.metadata.create_all(bind=engine)



app = FastAPI()

@app.on_event("startup")
async def startup_event():
    manager.loop = asyncio.get_running_loop()
    logger.info("Application started, WebSocket manager loop initialized")

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def log_requests(request: Request, call_next):
    import json
    body = await request.body()
    if body:
        print(f"\n METHOD : {request.method} \n URL : {request.url} \n Body: {body.decode()}\n ", flush=True)
    response = await call_next(request)
    return response

@app.websocket("/api/ws/scores")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        logger.info("MAIN WS: Client disconnected")
    except Exception as e:
        logger.error(f"MAIN WS: Error: {e}")
        manager.disconnect(websocket)
    

api_router = APIRouter(prefix="/api")
api_router.include_router(auth.router)
api_router.include_router(candidates.router)
app.include_router(api_router)


if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)

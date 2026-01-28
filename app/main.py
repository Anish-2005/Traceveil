from fastapi import FastAPI
from app.api.routes import router
from app.database.connection import create_tables

app = FastAPI(title="Traceveil - Real-Time Fraud & Cheating Detection", version="1.0.0")

@app.on_event("startup")
async def startup_event():
    create_tables()

app.include_router(router)

@app.get("/")
async def root():
    return {"message": "Traceveil API is running"}
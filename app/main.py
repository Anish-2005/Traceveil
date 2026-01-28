from fastapi import FastAPI
from app.api.routes import router

app = FastAPI(title="Traceveil - Real-Time Fraud & Cheating Detection", version="1.0.0")

app.include_router(router)

@app.get("/")
async def root():
    return {"message": "Traceveil API is running"}
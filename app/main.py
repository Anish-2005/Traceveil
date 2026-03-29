import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import router

app = FastAPI(title="Traceveil - Real-Time Fraud & Cheating Detection", version="1.0.0")

# Allow explicit origins from env (comma-separated) while keeping sensible local defaults.
configured_origins = os.getenv("CORS_ALLOWED_ORIGINS", "")
allow_origins = [
    origin.strip()
    for origin in configured_origins.split(",")
    if origin.strip()
] or [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    # Support Next.js dev auto-port selection (3001/3002/...) on local machine.
    allow_origin_regex=r"^https?://(localhost|127\.0\.0\.1)(:\d+)?$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

@app.get("/")
async def root():
    return {"message": "Traceveil API is running"}

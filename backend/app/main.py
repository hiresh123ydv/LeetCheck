from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import router
from dotenv import load_dotenv

load_dotenv()

from app.services.leetcode import get_user_profile
from app.services.llm import roast_profile

app = FastAPI(
    title="LeetCheck API",
    description="AI-powered LeetCode profile analyzer",
    version="1.0.0",
)

# Enable CORS for local development and preview
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)


@app.get("/")
def root():
    return {
        "message": "LeetCheck API is running"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


@app.get("/roast/{username}")
def roast(username: str):
    username = username.strip()
    if not username:
        raise HTTPException(status_code=400, detail="Username cannot be empty")

    try:
        profile = get_user_profile(username)
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"User '{username}' not found or LeetCode unavailable")

    try:
        roast_text = roast_profile(profile)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Roast generation failed: {str(e)}")

    return {
        "username": username,
        "roast": roast_text
    }


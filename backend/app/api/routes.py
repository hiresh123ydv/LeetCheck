from fastapi import APIRouter, HTTPException

from app.services.leetcode import get_user_profile


router = APIRouter()


@router.get("/analyze/{username}")
async def analyze_user(username: str):

    username = username.strip()

    if not username:
        raise HTTPException(
            status_code=400,
            detail="Username cannot be empty"
        )

    try:
        user = get_user_profile(username)

    except Exception as e:
        print("LeetCode Error:", e)

        raise HTTPException(
            status_code=502,
            detail="Failed to fetch data from LeetCode"
        )

    if user is None:
        raise HTTPException(
            status_code=404,
            detail=f"LeetCode user '{username}' not found"
        )

    return {
        "success": True,
        "user": user
    }
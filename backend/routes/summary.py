from fastapi import APIRouter

router = APIRouter()

@router.get("/api/summary")
def get_summary():
    return {
        "active_users": 3200,
        "purchases": 840,
        "top_campaigns": ["Summer Sale", "Free Coffee", "Referral Boost"]
    }
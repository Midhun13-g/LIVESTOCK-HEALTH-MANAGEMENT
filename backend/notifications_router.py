from fastapi import APIRouter, Depends
from datetime import datetime, timezone
from bson import ObjectId
from database import notifications_collection
from models import UserInDB


def serialize(n: dict) -> dict:
    return {**{k: v for k, v in n.items() if k != "_id"}, "id": str(n["_id"])}


def get_router(get_current_user_dep):
    r = APIRouter()

    @r.get("/")
    async def get_notifications(current_user: UserInDB = Depends(get_current_user_dep)):
        notes = list(
            notifications_collection
            .find({"username": current_user.username})
            .sort("created_at", -1)
        )
        return [serialize(n) for n in notes]

    # ── IMPORTANT: read-all MUST be before /{notification_id}/read ──
    @r.patch("/read-all")
    async def mark_all_read(current_user: UserInDB = Depends(get_current_user_dep)):
        notifications_collection.update_many(
            {"username": current_user.username},
            {"$set": {"read": True}}
        )
        return {"message": "All marked as read"}

    @r.patch("/{notification_id}/read")
    async def mark_as_read(notification_id: str, current_user: UserInDB = Depends(get_current_user_dep)):
        notifications_collection.update_one(
            {"_id": ObjectId(notification_id), "username": current_user.username},
            {"$set": {"read": True}}
        )
        return {"message": "Marked as read"}

    @r.delete("/{notification_id}")
    async def delete_notification(notification_id: str, current_user: UserInDB = Depends(get_current_user_dep)):
        notifications_collection.delete_one(
            {"_id": ObjectId(notification_id), "username": current_user.username}
        )
        return {"message": "Deleted"}

    return r


def create_notification(username: str, message: str, notif_type: str):
    """Helper to insert a notification from anywhere in the backend."""
    notifications_collection.insert_one({
        "username": username,
        "message": message,
        "type": notif_type,
        "read": False,
        "created_at": datetime.now(timezone.utc)
    })

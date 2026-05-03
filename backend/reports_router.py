from fastapi import APIRouter, Depends
from database import animals_collection
from models import UserInDB, compute_checkup_status
from collections import Counter
from datetime import datetime, timezone

def get_router(get_current_user_dep):
    router = APIRouter()

    @router.get("/summary")
    async def summary(current_user: UserInDB = Depends(get_current_user_dep)):
        animals = list(animals_collection.find({"owner_username": current_user.username}))
        total     = len(animals)
        healthy   = sum(1 for a in animals if a.get("status") == "healthy")
        treatment = sum(1 for a in animals if a.get("status") == "treatment")
        critical  = sum(1 for a in animals if a.get("status") == "critical")
        overdue   = sum(1 for a in animals if compute_checkup_status(a.get("next_checkup")) == "overdue")
        return {"total": total, "healthy": healthy, "treatment": treatment, "critical": critical, "overdue": overdue}

    @router.get("/health-status")
    async def health_status_distribution(current_user: UserInDB = Depends(get_current_user_dep)):
        animals = list(animals_collection.find({"owner_username": current_user.username}, {"status": 1}))
        counts = Counter(a["status"] for a in animals)
        return {"data": [{"status": k, "count": v} for k, v in counts.items()]}

    @router.get("/species-distribution")
    async def species_distribution(current_user: UserInDB = Depends(get_current_user_dep)):
        animals = list(animals_collection.find({"owner_username": current_user.username}, {"species": 1}))
        counts = Counter(a["species"] for a in animals)
        return {"data": [{"species": k, "count": v} for k, v in counts.items()]}

    @router.get("/checkup-status-breakdown")
    async def checkup_status_breakdown(current_user: UserInDB = Depends(get_current_user_dep)):
        animals = list(animals_collection.find({"owner_username": current_user.username}, {"next_checkup": 1}))
        counts = Counter(compute_checkup_status(a.get("next_checkup")) for a in animals)
        order = ["overdue", "today", "upcoming", "scheduled", "future", "unknown"]
        return {"data": [{"status": s, "count": counts.get(s, 0)} for s in order]}

    @router.get("/weight-by-species")
    async def weight_by_species(current_user: UserInDB = Depends(get_current_user_dep)):
        animals = list(animals_collection.find(
            {"owner_username": current_user.username, "weight": {"$ne": None}},
            {"species": 1, "weight": 1}
        ))
        groups = {}
        for a in animals:
            sp = a["species"]
            groups.setdefault(sp, []).append(a["weight"])
        result = [
            {"species": sp, "avg_weight": round(sum(w) / len(w), 1), "count": len(w)}
            for sp, w in groups.items()
        ]
        return {"data": sorted(result, key=lambda x: x["avg_weight"], reverse=True)}

    @router.get("/checkup-timeline")
    async def checkup_timeline(current_user: UserInDB = Depends(get_current_user_dep)):
        now = datetime.now(timezone.utc)
        animals = list(animals_collection.find(
            {"owner_username": current_user.username, "next_checkup": {"$ne": None}},
            {"name": 1, "species": 1, "next_checkup": 1, "status": 1}
        ).sort("next_checkup", 1).limit(10))
        result = []
        for a in animals:
            cs = compute_checkup_status(a.get("next_checkup"))
            result.append({
                "id": str(a["_id"]),
                "name": a["name"],
                "species": a["species"],
                "next_checkup": a["next_checkup"].isoformat() if a.get("next_checkup") else None,
                "status": a["status"],
                "checkup_status": cs,
            })
        return {"data": result}

    return router

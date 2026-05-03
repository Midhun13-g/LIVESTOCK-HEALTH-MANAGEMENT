from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime, timedelta, timezone
from database import animals_collection
from notifications_router import create_notification
from models import compute_checkup_status

scheduler = BackgroundScheduler()

def check_upcoming_checkups():
    """Runs daily: sends classified checkup notifications."""
    animals = list(animals_collection.find({"next_checkup": {"$ne": None}}))
    for animal in animals:
        status = compute_checkup_status(animal.get("next_checkup"))
        name    = animal["name"]
        species = animal["species"]
        username = animal["owner_username"]
        date_str = animal["next_checkup"].strftime("%Y-%m-%d") if animal.get("next_checkup") else ""

        if status == "overdue":
            create_notification(username, f"⚠️ Overdue checkup: {name} ({species}) was due on {date_str}", "checkup")
        elif status == "today":
            create_notification(username, f"📅 Checkup today: {name} ({species}) is due for a checkup today!", "checkup")
        elif status == "upcoming":
            create_notification(username, f"🔔 Upcoming checkup: {name} ({species}) is due on {date_str} (within 7 days)", "checkup")

def check_critical_animals():
    """Runs daily: notify about critical animals."""
    animals = list(animals_collection.find({"status": "critical"}))
    for animal in animals:
        create_notification(
            username=animal["owner_username"],
            message=f"🚨 ALERT: {animal['name']} ({animal['species']}) is in critical condition!",
            notif_type="critical"
        )

def start_scheduler():
    now = datetime.now(timezone.utc)
    # Run first check at next midnight, then every 24h — prevents duplicates on restart
    next_midnight = (now + timedelta(days=1)).replace(hour=0, minute=0, second=0, microsecond=0)
    scheduler.add_job(check_upcoming_checkups, "interval", hours=24, id="checkup_reminder", next_run_time=next_midnight)
    scheduler.add_job(check_critical_animals,  "interval", hours=24, id="critical_alert",   next_run_time=next_midnight)
    scheduler.start()

def stop_scheduler():
    scheduler.shutdown()

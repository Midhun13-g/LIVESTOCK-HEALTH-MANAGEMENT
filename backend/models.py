from pydantic import BaseModel, computed_field
from datetime import datetime, timezone
from typing import Optional

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: str | None = None

class User(BaseModel):
    username: str
    email: str | None = None

class UserInDB(User):
    hashed_password: str

def compute_checkup_status(next_checkup: Optional[datetime]) -> str:
    """Classify next_checkup into: overdue | today | upcoming | scheduled | future | unknown"""
    if not next_checkup:
        return "unknown"
    now = datetime.now(timezone.utc)
    # make next_checkup timezone-aware if it isn't
    if next_checkup.tzinfo is None:
        next_checkup = next_checkup.replace(tzinfo=timezone.utc)
    delta = (next_checkup.date() - now.date()).days
    if delta < 0:    return "overdue"
    if delta == 0:   return "today"
    if delta <= 7:   return "upcoming"
    if delta <= 30:  return "scheduled"
    return "future"

class Animal(BaseModel):
    id: Optional[str] = None
    name: str
    species: str
    breed: str
    dob: Optional[datetime] = None
    next_checkup: Optional[datetime] = None
    weight: Optional[float] = None
    status: str = "healthy"
    owner_username: Optional[str] = None

    @computed_field
    @property
    def checkup_status(self) -> str:
        return compute_checkup_status(self.next_checkup)

class AnimalDetails(BaseModel):
    name: str
    species: str
    breed: str
    dob: Optional[datetime] = None
    next_checkup: Optional[datetime] = None
    weight: Optional[float] = None
    status: str = "healthy"

class Notification(BaseModel):
    id: Optional[str] = None
    username: str
    message: str
    type: str  # checkup | critical | prediction | general
    read: bool = False
    created_at: datetime = None

class ChatMessage(BaseModel):
    message: str

class ReportQuery(BaseModel):
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None

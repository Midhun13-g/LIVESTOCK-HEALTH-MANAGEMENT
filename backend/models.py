from pydantic import BaseModel
from datetime import date,datetime
from typing import Optional
# Models
class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: str | None = None


class User(BaseModel):
    username: str
    email: str | None = None
    # disabled: bool | None = None


class UserInDB(User):
    hashed_password: str


class Animal(BaseModel):
    name: str
    species: str
    breed: str
    dob: datetime
    next_checkup: datetime
    weight: float
    status: str
    owner_username: str

class AnimalDetails(BaseModel):
    name: str
    species: str
    breed: str
    dob: Optional[datetime]
    next_checkup: Optional[datetime]
    weight: Optional[float]
    status: str = "healthy"

    def dict(self, *args, **kwargs):
        data = super().dict(*args, **kwargs)
        for key, value in data.items():
            if isinstance(value, date):
                data[key] = datetime.combine(value, datetime.min.time())
        return data

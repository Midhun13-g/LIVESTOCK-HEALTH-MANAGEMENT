import uuid
from pydantic import BaseModel, EmailStr
from typing import Optional

class User(BaseModel):
    email: EmailStr
    password: str

class Animal(BaseModel):
    animal_id: str = uuid.uuid4().hex  # UUID for the animal
    user_id: str  # User ID to link the animal to the user
    breed: Optional[str]  # Optional breed field
    age: Optional[int]    # Optional age field
    gender: Optional[str] # Optional gender field

    class Config:
        orm_mode = True

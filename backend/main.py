from motor.motor_asyncio import AsyncIOMotorClient
from fastapi import FastAPI, HTTPException, status
from models import User
from fastapi.middleware.cors import CORSMiddleware
from database import collection
from passlib.context import CryptContext # type: ignore
from chatbot import router as chatbot_router  # Import the chatbot router

app = FastAPI()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

origins = ['http://localhost:3000']

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/register")
async def register(user: User):
    existing_user = await collection.find_one({"email": user.email})
    hashed_password = pwd_context.hash(user.password)
    user.password = hashed_password
    if existing_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
    await collection.insert_one(user.dict())
    return {"message": "User registered successfully"}

@app.post("/login")
async def login(user: User):
    existing_user = await collection.find_one({"email": user.email})

    if not existing_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    if not pwd_context.verify(user.password, existing_user["password"]):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect password")
    return {"message": "User logged in successfully"}

# Include the chatbot router
app.include_router(chatbot_router, prefix="/chatbot", tags=["Chatbot"])

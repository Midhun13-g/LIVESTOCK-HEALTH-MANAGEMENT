import os
from typing import List, Dict
from datetime import datetime, timedelta, timezone
from typing import Annotated
from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from jwt.exceptions import InvalidTokenError
from passlib.context import CryptContext
from bson import ObjectId
from dotenv import load_dotenv
import jwt

from database import users_collection, animals_collection
from models import AnimalDetails, Animal, User, UserInDB, Token, TokenData, compute_checkup_status
import notifications_router as notif_module
import reports_router
import chatbot
import prediction_router as pred_module
from scheduler import start_scheduler, stop_scheduler

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# ── Auth helpers ──────────────────────────────────────────────────────────────

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def get_user(username: str) -> UserInDB | None:
    doc = users_collection.find_one({"username": username})
    if doc:
        doc.pop("_id", None)
        return UserInDB(**doc)
    return None

def authenticate_user(username: str, password: str) -> UserInDB | bool:
    user = get_user(username)
    if not user or not verify_password(password, user.hashed_password):
        return False
    return user

def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]) -> UserInDB:
    exc = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if not username:
            raise exc
        token_data = TokenData(username=username)
    except InvalidTokenError:
        raise exc
    user = get_user(token_data.username)
    if not user:
        raise exc
    return user

# ── App lifecycle ─────────────────────────────────────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):
    start_scheduler()
    yield
    stop_scheduler()

app = FastAPI(title="Livestock Health Management API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    # ADDED FOR DEPLOYMENT: read allowed origins from env, fallback to localhost for dev
    allow_origins=os.getenv(
        "ALLOWED_ORIGINS",
        "http://localhost:3000,http://127.0.0.1:3000"
    ).split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Auth routes ───────────────────────────────────────────────────────────────

@app.post("/register")
async def register_user(user: UserInDB):
    if users_collection.find_one({"username": user.username}):
        raise HTTPException(status_code=400, detail="Username already exists")
    doc = user.model_dump()
    doc["hashed_password"] = get_password_hash(user.hashed_password)
    users_collection.insert_one(doc)
    return {"message": "User registered successfully"}

@app.post("/token", response_model=Token)
async def login(form_data: Annotated[OAuth2PasswordRequestForm, Depends()]) -> Token:
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Incorrect username or password", headers={"WWW-Authenticate": "Bearer"})
    access_token = create_access_token(
        data={"sub": user.username},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    return Token(access_token=access_token, token_type="bearer")

@app.get("/users/me", response_model=User)
async def read_users_me(current_user: Annotated[User, Depends(get_current_user)]):
    return current_user

# ── Animal routes ─────────────────────────────────────────────────────────────

def serialize_animal(a: dict) -> dict:
    a["id"] = str(a["_id"])
    del a["_id"]
    return a

@app.get("/animals/", response_model=List[Animal])
async def get_animals(current_user: UserInDB = Depends(get_current_user)):
    animals = list(animals_collection.find({"owner_username": current_user.username}))
    return [serialize_animal(a) for a in animals]

@app.get("/animals/checkup-summary", response_model=Dict[str, List[Animal]])
async def get_checkup_summary(current_user: UserInDB = Depends(get_current_user)):
    """Returns animals grouped by checkup_status: overdue, today, upcoming, scheduled, future, unknown"""
    animals = [Animal(**serialize_animal(a)) for a in animals_collection.find({"owner_username": current_user.username})]
    groups: Dict[str, List[Animal]] = {"overdue": [], "today": [], "upcoming": [], "scheduled": [], "future": [], "unknown": []}
    for a in animals:
        groups[a.checkup_status].append(a)
    return groups

@app.post("/animals/", response_model=Animal)
async def create_animal(animal: AnimalDetails, current_user: UserInDB = Depends(get_current_user)):
    doc = animal.model_dump()
    doc["owner_username"] = current_user.username
    result = animals_collection.insert_one(doc)
    doc["id"] = str(result.inserted_id)
    doc.pop("_id", None)
    if animal.status == "critical":
        notif_module.create_notification(current_user.username, f"{animal.name} was added with critical status!", "critical")
    return doc

@app.put("/animals/{animal_id}", response_model=Animal)
async def update_animal(animal_id: str, animal: AnimalDetails, current_user: UserInDB = Depends(get_current_user)):
    try:
        oid = ObjectId(animal_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid animal ID")
    existing = animals_collection.find_one({"_id": oid, "owner_username": current_user.username})
    if not existing:
        raise HTTPException(status_code=404, detail="Animal not found")
    update_data = {k: v for k, v in animal.model_dump().items() if v is not None}
    animals_collection.update_one({"_id": oid}, {"$set": update_data})
    updated = animals_collection.find_one({"_id": oid})
    if animal.status == "critical" and existing.get("status") != "critical":
        notif_module.create_notification(current_user.username, f"{animal.name} status changed to critical!", "critical")
    return serialize_animal(updated)

@app.delete("/animals/{animal_id}")
async def delete_animal(animal_id: str, current_user: UserInDB = Depends(get_current_user)):
    try:
        oid = ObjectId(animal_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid animal ID")
    result = animals_collection.delete_one({"_id": oid, "owner_username": current_user.username})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Animal not found")
    return {"message": "Animal deleted"}

# ── Include routers ───────────────────────────────────────────────────────────

app.include_router(notif_module.get_router(get_current_user), prefix="/notifications", tags=["Notifications"])
app.include_router(reports_router.get_router(get_current_user), prefix="/reports", tags=["Reports"])
app.include_router(chatbot.get_router(get_current_user), prefix="/chatbot", tags=["Chatbot"])
app.include_router(pred_module.get_router(get_current_user), prefix="/api/prediction", tags=["Prediction"])

import os
from typing import List
from datetime import datetime, timedelta, timezone
from typing import Annotated
from database import users_collection, animals_collection
import jwt  # type: ignore
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jwt.exceptions import InvalidTokenError  # type: ignore
from passlib.context import CryptContext  # type: ignore
from bson import ObjectId
from dotenv import load_dotenv
from models import AnimalDetails, User, UserInDB, Token, TokenData,Animal  # Import models from models.py
from fastapi.middleware.cors import CORSMiddleware
from chatbot import router as chatbot_router 
from prediction_router import router as prediction_router

load_dotenv()

# Constants for JWT
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Utility functions
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
app = FastAPI()

origins = [
    "http://localhost:3000",  # React dev server
    "http://127.0.0.1:3000",  # React dev server (alternative)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allows these origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Allows all headers
)

# Models (now imported from models.py)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def get_user(username: str) -> UserInDB | None:
    user_dict = users_collection.find_one({"username": username})
    if user_dict:
        user_dict["id"] = str(user_dict["_id"])
        return UserInDB(**user_dict)
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
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]) -> UserInDB:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except InvalidTokenError:
        raise credentials_exception
    user = get_user(username=token_data.username)
    if user is None:
        raise credentials_exception
    return user

# Routes
@app.post("/register")
async def register_user(user: UserInDB):
    if users_collection.find_one({"username": user.username}):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already exists",
        )
    
    hashed_password = get_password_hash(user.hashed_password)
    user_dict = user.dict()
    user_dict["hashed_password"] = hashed_password
    users_collection.insert_one(user_dict)
    
    return {"message": "User registered successfully"}

@app.post("/token", response_model=Token)
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()]
) -> Token:
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return Token(access_token=access_token, token_type="bearer")

@app.get("/users/me/", response_model=User)
async def read_users_me(
    current_user: Annotated[User, Depends(get_current_user)]
) -> User:
    return current_user

@app.post("/animals/", response_model=AnimalDetails)
async def create_animal(animal: AnimalDetails, current_user: UserInDB = Depends(get_current_user)):
    # Animal object is automatically parsed and defaults handled by Pydantic model
    animal_dict = animal.dict()  # Convert to dictionary
    animal_dict["owner_username"] = current_user.username  # Automatically add the owner_username

    # Insert the animal data into the database
    result = animals_collection.insert_one(animal_dict)

    # Return the inserted animal with ID
    animal_dict["id"] = str(result.inserted_id)

    return animal_dict


@app.put("/animals/{animal_id}", response_model=AnimalDetails)
async def update_animal(
    animal_id: str, animal: Animal, current_user: UserInDB = Depends(get_current_user)
):
    try:
        animal_object_id = ObjectId(animal_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid animal ID format")

    existing_animal = animals_collection.find_one(
        {"_id": animal_object_id, "owner_username": current_user.username}
    )

    if not existing_animal:
        raise HTTPException(status_code=404, detail="Animal not found or not owned by user")

    animal_details = AnimalDetails(
        name=animal.name,
        species=animal.species,
        breed=animal.breed,
        dob=animal.dob,
        next_checkup=animal.next_checkup,
        weight=animal.weight,
        status=animal.status,
    )

    update_data = animal_details.dict(exclude_unset=True)
    update_data.pop("owner_username", None)

    result = animals_collection.update_one({"_id": animal_object_id}, {"$set": update_data})

    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Animal not updated")

    updated_animal = animals_collection.find_one({"_id": animal_object_id})
    updated_animal["id"] = str(updated_animal["_id"])
    del updated_animal["_id"]

    return updated_animal



@app.get("/animals/", response_model=List[Animal])
async def get_animals(current_user: UserInDB = Depends(get_current_user)):
    # Fetch all animals for the current user based on their username
    animals = list(animals_collection.find({"owner_username": current_user.username}))

    if not animals:
        raise HTTPException(status_code=404, detail="No animals found for this user")
    
    # Add 'id' and remove '_id' field from the database records for the response
    for animal in animals:
        animal["id"] = str(animal["_id"])
        del animal["_id"]

    return animals


app.include_router(prediction_router, prefix="/api/prediction", tags=["Prediction"])


app.include_router(chatbot_router, prefix="/chatbot", tags=["Chatbot"])
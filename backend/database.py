from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL")

if not MONGO_URL:
    raise ValueError("MONGO_URL is not set in environment variables")
client = MongoClient(MONGO_URL)
db = client["Livestock"]

users_collection = db["users"]
animals_collection = db["animals"]
notifications_collection = db["notifications"]
chat_history_collection = db["chat_history"]

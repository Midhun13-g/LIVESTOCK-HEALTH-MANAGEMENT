from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")

if not MONGO_URI:
    raise ValueError("MONGO_URI is not set in environment variables")
client = MongoClient(MONGO_URI)
db = client["Livestock"]

users_collection = db["users"]
animals_collection = db["animals"]
notifications_collection = db["notifications"]
chat_history_collection = db["chat_history"]

from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

# Accept both MONGO_URI and MONGO_URL, fallback to localhost for local dev
MONGO_URI = os.getenv("MONGO_URI") or os.getenv("MONGO_URL", "mongodb://localhost:27017")

client = MongoClient(MONGO_URI)
db = client["Livestock"]

users_collection = db["users"]
animals_collection = db["animals"]
notifications_collection = db["notifications"]
chat_history_collection = db["chat_history"]

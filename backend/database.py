from pymongo import MongoClient

MONGO_URI = "mongodb://localhost:27017"  # Replace with your MongoDB connection string
client = MongoClient(MONGO_URI)
db = client["Livestock"]
users_collection = db["users"]
animals_collection = db["animals"] 
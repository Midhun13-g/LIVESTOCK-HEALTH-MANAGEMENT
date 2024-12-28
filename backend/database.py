import motor.motor_asyncio

try:
    client = motor.motor_asyncio.AsyncIOMotorClient('mongodb://localhost:27017')
    db = client.Livestock
    collection = db.UsersCollections
    collection = db.Animals
except ConnectionError:
    print("Could not connect to MongoDB.")
    raise

print("Connecting to MongoDB")
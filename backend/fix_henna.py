from pymongo import MongoClient
import sys

c = MongoClient('mongodb://localhost:27017')
col = c['Livestock']['animals']

hennas = list(col.find({'name': 'Henna', 'owner_username': 'midhun'}, {'_id': 1, 'name': 1}))
sys.stdout.write(f"Found {len(hennas)} Henna records\n")
sys.stdout.flush()

if len(hennas) >= 1:
    col.delete_one({'_id': hennas[0]['_id']})
    sys.stdout.write(f"Deleted one Henna: {hennas[0]['_id']}\n")
    sys.stdout.flush()

remaining = col.count_documents({'owner_username': 'midhun'})
sys.stdout.write(f"Total animals remaining: {remaining}\n")
sys.stdout.flush()

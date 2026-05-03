from pymongo import MongoClient
from datetime import datetime
import sys

c = MongoClient('mongodb://localhost:27017')
col = c['Livestock']['animals']

animals = [
    {'name':'Max','species':'Pig','breed':'Yorkshire','dob':datetime(2022,6,20),'next_checkup':datetime(2025,6,15),'weight':95.0,'status':'treatment','owner_username':'midhun'},
    {'name':'Luna','species':'Sheep','breed':'Merino','dob':datetime(2021,9,5),'next_checkup':datetime(2025,8,1),'weight':62.0,'status':'healthy','owner_username':'midhun'},
    {'name':'Thunder','species':'Horse','breed':'Arabian','dob':datetime(2018,1,12),'next_checkup':datetime(2025,6,20),'weight':520.0,'status':'healthy','owner_username':'midhun'},
    {'name':'Daisy','species':'Cow','breed':'Jersey','dob':datetime(2019,11,8),'next_checkup':datetime(2025,5,30),'weight':410.0,'status':'critical','owner_username':'midhun'},
    {'name':'Rocky','species':'Goat','breed':'Boer','dob':datetime(2023,2,14),'next_checkup':datetime(2025,7,25),'weight':45.0,'status':'healthy','owner_username':'midhun'},
    {'name':'Penny','species':'Chicken','breed':'Leghorn','dob':datetime(2024,1,1),'next_checkup':datetime(2025,6,5),'weight':2.5,'status':'healthy','owner_username':'midhun'},
    {'name':'Bruno','species':'Pig','breed':'Berkshire','dob':datetime(2022,8,30),'next_checkup':datetime(2025,7,15),'weight':110.0,'status':'treatment','owner_username':'midhun'},
]

for a in animals:
    r = col.insert_one(a)
    sys.stdout.write(f"Inserted {a['name']}: {r.inserted_id}\n")
    sys.stdout.flush()

total = col.count_documents({'owner_username': 'midhun'})
sys.stdout.write(f"Total animals: {total}\n")
sys.stdout.flush()

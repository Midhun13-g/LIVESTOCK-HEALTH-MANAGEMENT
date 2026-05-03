from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from datetime import datetime, timezone
import os
from dotenv import load_dotenv
from groq import Groq
from database import chat_history_collection, animals_collection

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

SYSTEM_PROMPT = (
    "You are Cooper, an AI assistant for a livestock health management system. "
    "You help farmers monitor and manage their livestock health. "
    "Ask about symptoms, advise on care, and flag potential diseases. "
    "Keep responses short, clear, and livestock-focused only."
)

class Message(BaseModel):
    message: str

def get_router(get_current_user_dep):
    router = APIRouter()

    @router.get("/")
    def welcome():
        return {"message": "Welcome to Cooper, the AI Assistant for Livestock Health Management!"}

    @router.post("/chat")
    def chat_with_cooper(msg: Message, current_user=Depends(get_current_user_dep)):
        try:
            # Fetch user's animals for context
            animals = list(animals_collection.find(
                {"owner_username": current_user.username},
                {"_id": 0, "name": 1, "species": 1, "breed": 1, "status": 1}
            ))
            animal_context = ""
            if animals:
                animal_context = "User's livestock: " + ", ".join(
                    f"{a['name']} ({a['species']}, status: {a.get('status','unknown')})"
                    for a in animals
                ) + ". "

            # Fetch last 10 messages from MongoDB
            history_docs = list(chat_history_collection.find(
                {"username": current_user.username},
                {"_id": 0, "role": 1, "content": 1}
            ).sort("created_at", -1).limit(10))
            history_docs.reverse()

            # Build messages for Groq
            messages = [{"role": "system", "content": SYSTEM_PROMPT}]
            for h in history_docs:
                messages.append({"role": h["role"], "content": h["content"]})

            # Add animal context + user message
            user_content = animal_context + msg.message if animal_context else msg.message
            messages.append({"role": "user", "content": user_content})

            response = client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=messages,
                max_tokens=512,
                temperature=0.5,
            )
            model_response = response.choices[0].message.content

            # Save to MongoDB
            now = datetime.now(timezone.utc)
            chat_history_collection.insert_many([
                {"username": current_user.username, "role": "user", "content": msg.message, "created_at": now},
                {"username": current_user.username, "role": "assistant", "content": model_response, "created_at": now},
            ])

            return {"response": model_response}

        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    @router.get("/history")
    def get_chat_history(current_user=Depends(get_current_user_dep)):
        history = list(chat_history_collection.find(
            {"username": current_user.username},
            {"_id": 0, "role": 1, "content": 1, "created_at": 1}
        ).sort("created_at", 1).limit(50))
        # Convert to parts format for frontend compatibility
        result = [{"role": h["role"], "parts": [h["content"]], "created_at": h.get("created_at")} for h in history]
        return {"history": result}

    @router.delete("/history")
    def clear_history(current_user=Depends(get_current_user_dep)):
        chat_history_collection.delete_many({"username": current_user.username})
        return {"message": "Chat history cleared"}

    return router

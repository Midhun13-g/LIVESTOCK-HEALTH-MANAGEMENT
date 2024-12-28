from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import os
from dotenv import load_dotenv
import google.generativeai as genai

# Load environment variables
load_dotenv()

# Configure the Gemini API
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Initialize the model
generation_config = {
    "temperature": 0.5,
    "top_p": 0.95,
    "top_k": 40,
    "max_output_tokens": 8192,
    "response_mime_type": "text/plain",
}

model = genai.GenerativeModel(
    model_name="gemini-2.0-flash-exp",
    generation_config=generation_config,
    system_instruction="You're an AI assistant for a livestock health management system. Have your name as Cooper and introduce yourself as an AI assistant for this system. The user will contact you for any health-related queries of the livestock. Ask them for the symptoms and if you have doubts whether the livestock has caught any disease, let the users know. Ask as many questions as you want but always keep your texts neat, simple, and short. Advise the users on how to take care of their livestock based on your conversations or in general. You should only speak related to the livestock management application and not anything in general.",
)

# Define the message schema
class Message(BaseModel):
    message: str

# History to maintain the conversation state
history = []

# Create a router for chatbot endpoints
router = APIRouter()

@router.get("/")
def welcome():
    return {"message": "Welcome to Cooper, the AI Assistant for Livestock Health Management!"}

@router.post("/chat")
def chat_with_cooper(msg: Message):
    try:
        user_input = msg.message

        # Start a chat session
        chat_session = model.start_chat(
            history=history
        )

        # Get the model response
        response = chat_session.send_message(user_input)
        model_response = response.text

        # Update the conversation history
        history.append({"role": "user", "parts": [user_input]})
        history.append({"role": "assistant", "parts": [model_response]})

        # Return the chatbot's response
        return {"response": model_response}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

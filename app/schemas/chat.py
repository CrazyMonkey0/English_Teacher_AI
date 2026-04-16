from pydantic import BaseModel
import uuid

class ChatRequest(BaseModel):
    conversation_id: uuid.UUID
    message: str
    
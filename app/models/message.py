import uuid
from datetime import datetime
from sqlalchemy import Text, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from db.database import Base

class Message(Base):
    __tablename__ = "messages"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    conversation_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("conversations.id"))
    role: Mapped[str] = mapped_column(String(50))  # 'user', 'assistant', 'system'
    content: Mapped[str] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)

    # Relacja zwrotna
    conversation: Mapped["Conversation"] = relationship("Conversation", back_populates="messages")
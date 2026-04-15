import uuid
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from models.message import Message


async def get_formatted_context(
    session: AsyncSession,
    conv_id: uuid.UUID,
    limit: int = 6
):
    stmt = (
        select(Message)
        .where(Message.conversation_id == conv_id)
        .order_by(Message.created_at.desc())
        .limit(limit)
    )

    result = await session.execute(stmt)
    messages = result.scalars().all()

    final_context = [
        {"role": "system", "content": "You are a friendly English Teacher."}
    ]

    for m in reversed(messages):
        final_context.append({
            "role": m.role,
            "content": m.content
        })

    return final_context


async def create_new_message(
    session: AsyncSession,
    conv_id: uuid.UUID,
    role: str,
    content: str
):
    new_msg = Message(
        conversation_id=conv_id,
        role=role,
        content=content
    )

    session.add(new_msg)

    return new_msg
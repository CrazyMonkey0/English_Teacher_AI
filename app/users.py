from typing import Optional, AsyncGenerator
from fastapi import Depends, HTTPException, Request
from fastapi_users import BaseUserManager, IntegerIDMixin, FastAPIUsers
from fastapi_users.db import SQLAlchemyUserDatabase
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from models.user import User
from db.database import get_async_session
from core.security import auth_backend, SECRET

# User database adapter
async def get_user_db(
    session: AsyncSession = Depends(get_async_session)
) -> AsyncGenerator[SQLAlchemyUserDatabase, None]:
    yield SQLAlchemyUserDatabase(session, User)

# User Manager
class UserManager(IntegerIDMixin, BaseUserManager[User, int]):
    reset_password_token_secret = SECRET
    verification_token_secret = SECRET
    reset_password_token_lifetime_seconds = 60 * 15  # 15 minutes 

    async def on_after_register(self, user: User, request: Optional[Request] = None): 
        print(f"User {user.id} has registered.")

    async def on_after_forgot_password(
        self, user: User, token: str, request: Optional[Request] = None
    ):
        print(f"""
Hello,

We have received a request to reset the password for your account.
To set a new password, click on the link below:

http://127.0.0.1:5173/reset-password?token={token}


⚠️ The link is valid for 15 minutes!

If this is not you, please ignore this message—your password will remain unchanged.

Best regards,
    The English Buddy Team
""")
    
    async def create(self, user_create, safe = False, request = None):
        if not getattr(user_create, "username", None):
            raise HTTPException(status_code=400, detail="No username provided.")

        query = select(User).where(User.username == user_create.username)
        result = await self.user_db.session.execute(query)
        existing_user = result.scalar_one_or_none()
        if existing_user:
            raise HTTPException(status_code=400, detail="Username already exists.")
            
        return await super().create(user_create, safe, request)

async def get_user_manager(user_db: SQLAlchemyUserDatabase = Depends(get_user_db)):
    yield UserManager(user_db)

# FastAPIUsers instance
fastapi_users = FastAPIUsers[User, int](
    get_user_manager,
    [auth_backend],
)

# Dependencies
current_active_user = fastapi_users.current_user(active=True)
current_superuser = fastapi_users.current_user(active=True, superuser=True)
from fastapi import APIRouter, Depends
from users import fastapi_users
from core.security import auth_backend
from core.rate_limit import limiter
from schemas.user import UserRead, UserCreate

router = APIRouter()

router.include_router(
    fastapi_users.get_auth_router(auth_backend),
)

router.include_router(
    fastapi_users.get_register_router(UserRead, UserCreate), 
)

router.include_router(
    fastapi_users.get_reset_password_router(), 
)

router.include_router(
    fastapi_users.get_verify_router(UserRead),
)
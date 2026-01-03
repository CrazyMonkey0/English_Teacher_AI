from fastapi import APIRouter
from users import fastapi_users
from schemas.user import UserRead, UserUpdate

router = APIRouter()

# Endpointy użytkowników (me, update, delete)
router.include_router(
    fastapi_users.get_users_router(UserRead, UserUpdate),
)
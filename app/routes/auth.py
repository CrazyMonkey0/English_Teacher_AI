from fastapi import APIRouter
from users import fastapi_users
from core.security import auth_backend
from schemas.user import UserRead, UserCreate

router = APIRouter()

# Logowanie i wylogowanie
router.include_router(
    fastapi_users.get_auth_router(auth_backend),
    prefix="/jwt",
)

# Rejestracja
router.include_router(
    fastapi_users.get_register_router(UserRead, UserCreate),
)

# Reset hasła
router.include_router(
    fastapi_users.get_reset_password_router(),
)

# Weryfikacja email (opcjonalnie)
router.include_router(
    fastapi_users.get_verify_router(UserRead),
)
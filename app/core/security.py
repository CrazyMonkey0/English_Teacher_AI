from fastapi_users.authentication import (
    AuthenticationBackend,
    CookieTransport,
    JWTStrategy,
)
import os
from dotenv import load_dotenv
load_dotenv()

SECRET = os.getenv("JWT_SECRET")
bearer_transport = CookieTransport(cookie_name="front_auth_token", 
                                   cookie_secure=True, # require HTTPS
                                   cookie_httponly=True, 
                                   cookie_samesite="lax",
                                   cookie_max_age=86400) # 1 day

def get_jwt_strategy() -> JWTStrategy:
    return JWTStrategy(secret=SECRET, lifetime_seconds=3600)

auth_backend = AuthenticationBackend(
    name="jwt",
    transport=bearer_transport,
    get_strategy=get_jwt_strategy,
)
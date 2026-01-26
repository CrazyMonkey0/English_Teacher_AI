from fastapi import APIRouter, Response, Request
from core.rate_limit import limiter
import secrets

from sympy import false

router = APIRouter()

def generate_csrf_token():
    return secrets.token_urlsafe(32)

@router.get("/csrf")
@limiter.limit("30/minute")  # Rate limit: 30 requests per minute
def csrf(request: Request, response: Response):
    token = generate_csrf_token()
    response.set_cookie(
        # key="__Host-csrf",  # Using "__Host-" prefix for better security only https
        key="csrf_token",
        value=token, 
        secure=False,  # Set to True in production with HTTPS
        samesite="lax",
        httponly=False,
    )
    return {"ok": True}

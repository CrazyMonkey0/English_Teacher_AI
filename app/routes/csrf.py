from fastapi import APIRouter, Response
import secrets

from sympy import false

router = APIRouter()

def generate_csrf_token():
    return secrets.token_urlsafe(32)

@router.get("/csrf")
def csrf(response: Response):
    token = generate_csrf_token()
    response.set_cookie(
        key="csrf_token",
        value=token,
        secure=false,  # Set to True in production with HTTPS
        samesite="lax",
        httponly=False,
    )
    return {"ok": True}

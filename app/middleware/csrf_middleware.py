# middleware/csrf_middleware.py
from starlette.middleware.base import BaseHTTPMiddleware
from fastapi import Request
from fastapi.responses import JSONResponse

class CSRFMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next): 
        if request.method.upper() in ["POST", "PUT", "PATCH", "DELETE"]:
            csrf_cookie = request.cookies.get("csrf_token")
            csrf_header = request.headers.get("X-CSRF-Token")
            
            if not csrf_cookie or not csrf_header:
                return JSONResponse(
                    status_code=403,
                    content={"detail": "CSRF token missing"}
                )
            if csrf_cookie != csrf_header:
                return JSONResponse(
                    status_code=403,
                    content={"detail": "Invalid CSRF token"}
                )

        return await call_next(request)
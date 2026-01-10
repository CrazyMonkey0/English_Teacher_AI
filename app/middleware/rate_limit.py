# middleware/rate_limit.py
from starlette.middleware.base import BaseHTTPMiddleware
from fastapi import Request
from fastapi.responses import JSONResponse
from collections import defaultdict
from datetime import datetime, timedelta
import asyncio

class RateLimitMiddleware(BaseHTTPMiddleware):
    def __init__(self, app):
        super().__init__(app)
        # Dictionary for storing request timestamps
        self.requests = defaultdict(list)
        self.locks = defaultdict(asyncio.Lock)
        
        # Configure rate limits
        self.limits = {
            'login': (10, 60),           
            'logout': (10, 60),        
            'register': (2, 60),       
            'forgot-password': (4, 3600),
            'reset-password': (4, 3600),
            'request-verify-token': (5, 3600),
            'verify': (10, 3600),
            'me': (8, 60),
        }
    
    def _get_limit_key(self, path: str) -> tuple[str, int, int] | None:
        """Returns (endpoint_name, max_requests, window) for a given path"""
        for endpoint, (max_req, window) in self.limits.items():
            if endpoint in path:
                return (endpoint, max_req, window)
        return None
    
    async def dispatch(self, request: Request, call_next):
        path = request.url.path
        client_ip = request.client.host
        
        # Get the limit info for the current path
        limit_info = self._get_limit_key(path)
        
        if limit_info:
            endpoint_name, max_requests, window = limit_info
            key = f"{client_ip}:{endpoint_name}"
            
            async with self.locks[key]:
                now = datetime.now()
                cutoff = now - timedelta(seconds=window)
                
                # Remove old requests
                self.requests[key] = [
                    req_time for req_time in self.requests[key]
                    if req_time > cutoff
                ]
                
                # Check if the limit is exceeded
                if len(self.requests[key]) >= max_requests:
                    # Calculate retry after time
                    oldest_request = min(self.requests[key])
                    retry_after = int((oldest_request + timedelta(seconds=window) - now).total_seconds())
                    
                    # Return rate limit exceeded response
                    return JSONResponse(
                        status_code=429,
                        content={
                            "detail": "Rate limit exceeded",
                            "message": f"Too many requests. Try again in {retry_after} seconds.",
                            "retry_after": retry_after
                        },
                        headers={"Retry-After": str(max(retry_after, 1))}
                    )
                
                # Record the current request
                self.requests[key].append(now)
        
        return await call_next(request)
        
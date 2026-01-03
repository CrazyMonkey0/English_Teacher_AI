from fastapi_users import schemas

class UserRead(schemas.BaseUser[int]):
    first_name: str | None
    last_name: str | None
    username: str | None

class UserCreate(schemas.BaseUserCreate):
    first_name: str | None = None
    last_name: str | None = None
    username: str | None = None

class UserUpdate(schemas.BaseUserUpdate):
    first_name: str | None = None
    last_name: str | None = None
    username: str | None = None


from fastapi_users.db import SQLAlchemyBaseUserTable
from sqlalchemy import Column, String, Integer
from db.database import Base

class User(SQLAlchemyBaseUserTable[int], Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True)
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    username = Column(String, unique=True, nullable=False)
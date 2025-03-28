from pydantic import BaseModel, EmailStr
from datetime import datetime

# Data sent by client to create a new user
class UserCreate(BaseModel):
    restaurant_name: str
    email: EmailStr
    password: str
    address: str
    phone_number: str

# Data returned to client when reading user info (includes creation time)
class UserOut(BaseModel):
    id: str
    restaurant_name: str
    email: EmailStr
    address: str
    phone_number: str
    is_verified: bool
    created_at: datetime

# Data sent by client to log in
class UserLogin(BaseModel):
    email: EmailStr
    password: str

from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class MenuItemCreate(BaseModel):
    name: str
    description: str
    price: float
    image_url: Optional[str] = None

class MenuItemOut(BaseModel):
    id: str
    user_id: str
    name: str
    description: str
    price: float
    image_url: Optional[str] = None
    image_base64: Optional[str] = None

    created_at: datetime

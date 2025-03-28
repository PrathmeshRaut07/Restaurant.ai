from passlib.context import CryptContext
from bson import ObjectId
from datetime import datetime
from Models.user import UserCreate
from .core import get_db

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_user(user_data: UserCreate):
    """
    Insert a new user document into MongoDB.
    Returns the newly created user (dict) including creation time.
    """
    db = get_db()
    user_doc = {
        "restaurant_name": user_data.restaurant_name,
        "email": user_data.email.lower(),
        "hashed_password": get_password_hash(user_data.password),
        "address": user_data.address,
        "phone_number": user_data.phone_number,
        "is_verified": False,
        "created_at": datetime.utcnow()
    }
    result = db.users.insert_one(user_doc)
    user_doc["_id"] = result.inserted_id
    return user_doc

def get_user_by_email(email: str):
    """
    Retrieve a user document by email.
    Returns None if not found.
    """
    db = get_db()
    return db.users.find_one({"email": email.lower()})

def mark_user_verified(user_id):
    """
    Set is_verified to True for the user with _id == user_id.
    Returns the updated user document.
    """
    db = get_db()
    db.users.update_one({"_id": user_id}, {"$set": {"is_verified": True}})
    return db.users.find_one({"_id": user_id})

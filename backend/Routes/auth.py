from fastapi import APIRouter, HTTPException, status, BackgroundTasks
from bson import ObjectId
from Models.user import UserCreate, UserLogin
from Database.user import (
    create_user,
    get_user_by_email,
    verify_password,
    mark_user_verified
)
from Utils.token import create_access_token, decode_token
from Utils.email import send_verification_email

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/signup", response_model=dict)
async def signup(user_data: UserCreate, background_tasks: BackgroundTasks):
    """
    Creates a new user (storing the creation timestamp) and sends a verification email.
    """
    if get_user_by_email(user_data.email):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered.")

    user_doc = create_user(user_data)
    user_id = user_doc["_id"]

    token_data = {"sub": str(user_id)}
    token = create_access_token(token_data, expires_delta=60 * 24)  # Token valid for 24 hours

    background_tasks.add_task(send_verification_email, user_doc["email"], token)
    return {
        "message": "Signup successful! Please check your email to verify your account.",
        "created_at": user_doc["created_at"]
    }

@router.get("/verify")
def verify_email(token: str):
    """
    Verifies the user's email using the token provided.
    """
    payload = decode_token(token)
    if not payload:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired token.")
    
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid token payload.")

    try:
        user_id = ObjectId(user_id)
    except Exception:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid user ID in token.")

    updated_user = mark_user_verified(user_id)
    if not updated_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")

    if updated_user.get("is_verified"):
        return {"message": "Email verification successful. You can now log in."}
    else:
        return {"message": "Something went wrong; user was not verified."}

@router.post("/login", response_model=dict)
def login(login_data: UserLogin):
    """
    Logs in a user if credentials are correct and email is verified.
    """
    user = get_user_by_email(login_data.email)
    if not user or not verify_password(login_data.password, user["hashed_password"]):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials.")

    if not user["is_verified"]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Email not verified. Please verify your email first.")

    token_data = {"sub": str(user["_id"])}
    access_token = create_access_token(token_data)
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "message": "Login successful!"
    }

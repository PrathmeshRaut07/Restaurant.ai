from fastapi import Request, HTTPException, status, Header
from Utils.token import decode_token

async def get_current_user(request: Request, authorization: str = Header(None)):
    # Bypass token check for preflight OPTIONS requests
    if request.method.upper() == "OPTIONS":
        return None
    # If the header is missing or equals "Bearer null", raise an error.
    if not authorization or authorization.strip() == "" or authorization == "Bearer null":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid token"
        )
    token = authorization[7:]
    payload = decode_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload"
        )
    return user_id

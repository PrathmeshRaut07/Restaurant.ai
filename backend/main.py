import uvicorn

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from Routes.auth import router as auth_router

app = FastAPI()

origins = [
    "*",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,         # allow your React frontend
    allow_credentials=True,
    allow_methods=["POST", "OPTIONS"],  # explicitly allow POST and OPTIONS
    allow_headers=["*"],
)

app.include_router(auth_router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the FastAPI + MongoDB backend!"}


if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)

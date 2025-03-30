from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow requests from your frontend
origins = [
    "http://localhost:5173",  # React (Vite) dev server
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,            # Or ["*"] to allow all origins (dev only)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Your existing routes here
@app.get("/api/summary")
def get_summary():
    return {"message": "Hello from FastAPI!"}
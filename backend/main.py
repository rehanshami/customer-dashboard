from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import Base, engine
from fastapi import Depends
from sqlalchemy.orm import Session
from database import SessionLocal
from models import Customer
import models


Base.metadata.create_all(bind=engine)

app = FastAPI()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

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

@app.get("/api/customers")
def get_customers(db: Session = Depends(get_db)):
    customers = db.query(Customer).all()
    if not customers:
        print("No customers found")
    return customers
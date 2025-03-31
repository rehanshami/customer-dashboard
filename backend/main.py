from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import Base, engine
from fastapi import Depends
from sqlalchemy.orm import Session
from database import SessionLocal
from models import Customer
import models

# Create tables in the database
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI()

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# CORS configuration
origins = [
    "http://localhost:3000",  # React (Vite) dev server
    "https://customer-dashboard-e9kh.onrender.com/"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Routes
@app.get("/")
def read_root():
    return {"message": "Welcome to the Customer Insights Dashboard!"}


@app.get("/api/summary")
def get_summary():
    return {"message": "Hello from FastAPI!"}

@app.get("/api/customers")
def get_customers(db: Session = Depends(get_db)):
    customers = db.query(Customer).all()
    if not customers:
        print("No customers found")
    return customers

# Run the app using Uvicorn when this script is executed directly
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)  # Expose app on all interfaces (0.0.0.0) and port 8000

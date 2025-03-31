from sqlalchemy.orm import Session
from database import SessionLocal
from models import Customer

sample_customers = [
    Customer(name="Alice", age=29, location="Auckland", total_spent=450.75),
    Customer(name="Bob", age=34, location="Wellington", total_spent=300.50),
    Customer(name="Carol", age=42, location="Christchurch", total_spent=710.10),
    Customer(name="Dave", age=37, location="Auckland", total_spent=1220.00),
]

# Use the same database session
db: Session = SessionLocal()

for customer in sample_customers:
    db.add(customer)

db.commit()
db.close()
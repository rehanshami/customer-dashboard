from sqlalchemy.orm import Session
from database import SessionLocal
from models import Customer
import random

# Sample locations
locations = ["Auckland", "Wellington", "Christchurch", "Hamilton", "Tauranga", "Dunedin"]

# Generate realistic customer data
def generate_customers(n=100):
    names = [
        "Alice", "Bob", "Carol", "Dave", "Eve", "Frank", "Grace", "Hank", "Ivy", "Jack",
        "Kara", "Leo", "Mona", "Nathan", "Olivia", "Paul", "Quinn", "Rachel", "Steve", "Tina",
        "Uma", "Victor", "Wendy", "Xander", "Yara", "Zane"
    ]
    
    customers = []
    for _ in range(n):
        name = random.choice(names) + " " + random.choice(["Smith", "Johnson", "Brown", "Taylor", "Anderson"])
        age = random.randint(18, 75)
        location = random.choice(locations)
        total_spent = round(random.uniform(50, 5000), 2)  # Varied spending habits
        
        customers.append(Customer(name=name, age=age, location=location, total_spent=total_spent))
    
    return customers

# Insert into database
db: Session = SessionLocal()
db.bulk_save_objects(generate_customers(120))  # 120 entries for more complexity
db.commit()
db.close()

print("Database seeded with 120 customers!")
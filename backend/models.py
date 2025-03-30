from sqlalchemy import Column, Integer, String, Float
from database import Base

class Customer(Base):
    __tablename__ = "customers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    age = Column(Integer)
    location = Column(String)
    total_spent = Column(Float)
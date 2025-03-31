from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

DATABASE_URL = "postgresql://postgres_data_ibla_user:ZPA4bDYPYgTrVoj7clC3mQ0ZWt3zYjY2@dpg-cvl0901r0fns7387p1ig-a.oregon-postgres.render.com/postgres_data_ibla"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
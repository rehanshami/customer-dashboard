from fastapi import FastAPI
from routes import summary

app = FastAPI()

app.include_router(summary.router)

@app.get("/")
def read_root():
    return {"message": "Customer Insights Dashboard API"}
from fastapi import Depends, FastAPI
from sqlalchemy.orm import Session
import os
from dotenv import load_dotenv

from crud import get_random_puzzle
from database import SessionLocal, engine
from models import Base

# Load environment variables from .env file
load_dotenv()

# Access environment variables
API_KEY = os.getenv("API_KEY")

app = FastAPI(title="Sudoku API", root_path="/api")

# Create tables
Base.metadata.create_all(bind=engine)


# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/")
def read_api_root():
    return {
        "message": "Welcome to the Sudoku Solver API",
        "description": "This API provides solvable sudoku puzzles.",
        "endpoints": [
            {
                "path": "/api/", 
                "method": "GET",
                "description": "Returns API information and available endpoints"
            },
            {
                "path": "/api/puzzle", 
                "method": "GET", 
                "description": "Returns a random sudoku puzzle"
            }
        ],
        "version": "1.0"
    }


@app.get("/puzzle")
def read_random_puzzle(db: Session = Depends(get_db)):
    puzzle = get_random_puzzle(db)
    if puzzle:
        return {"puzzle": puzzle.puzzle}
    return {"error": "No puzzles found."}

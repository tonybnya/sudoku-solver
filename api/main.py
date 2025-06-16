
from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from crud import get_all_puzzles, get_random_puzzle
from database import SessionLocal, engine
from models import Base

app = FastAPI(title="Sudoku API", root_path="/api")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

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
            },
            {
                "path": "/api/puzzles",
                "method": "GET",
                "description": "Returns all sudoku puzzles"
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


@app.get("/puzzles")
def read_all_puzzles(db: Session = Depends(get_db)):
    puzzles = get_all_puzzles(db)
    if puzzles:
        return {"puzzles": [puzzle.puzzle for puzzle in puzzles]}
    return {"error": "No puzzles found."}

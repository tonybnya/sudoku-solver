from fastapi import Depends, FastAPI
from sqlalchemy.orm import Session

from .crud import get_random_puzzle
from .database import SessionLocal, engine
from .models import Base

app = FastAPI(title="Sudoku API")

# Create tables
Base.metadata.create_all(bind=engine)


# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/puzzle")
def read_random_puzzle(db: Session = Depends(get_db)):
    puzzle = get_random_puzzle(db)
    if puzzle:
        return {"puzzle": puzzle.puzzle}
    return {"error": "No puzzles found."}

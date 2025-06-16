from .database import SessionLocal, engine
from .models import Base, Puzzle

# Solvable puzzles
sample_puzzles = [
    "53..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....8..79",
    "1.5..2.84..8.3...6.3....9..9....7...6.1.2.3...8....6..5....8.3.3...2.61..72.6..4.9",
    ".....6....59.....82....8....45........3........6..3.54...325..6..................",
]


def populate():
    db = SessionLocal()
    Base.metadata.create_all(bind=engine)

    for puzzle_str in sample_puzzles:
        exists = db.query(Puzzle).filter_by(puzzle=puzzle_str).first()
        if not exists:
            db.add(Puzzle(puzzle=puzzle_str))
    db.commit()
    db.close()
    print(f"{len(sample_puzzles)} puzzles inserted.")


if __name__ == "__main__":
    populate()

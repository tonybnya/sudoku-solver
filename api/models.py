from sqlalchemy import Column, Integer, String

from .database import Base


class Puzzle(Base):
    __tablename__ = "puzzles"

    id = Column(Integer, primary_key=True, index=True)
    puzzle = Column(String(81), unique=True, nullable=False)

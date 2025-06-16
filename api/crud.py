from sqlalchemy.orm import Session
from sqlalchemy.sql import func

from models import Puzzle


def get_random_puzzle(db: Session):
    return db.query(Puzzle).order_by(func.random()).first()

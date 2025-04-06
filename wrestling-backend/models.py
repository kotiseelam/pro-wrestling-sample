from sqlalchemy import Column, Integer, String
from database import Base

class Wrestler(Base):
    __tablename__ = "wrestlers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    brand = Column(String)
    wins = Column(Integer, default=0)
    losses = Column(Integer, default=0)

from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import SessionLocal, engine
from models import Base, Wrestler
from pydantic import BaseModel

Base.metadata.create_all(bind=engine)

app = FastAPI()

# 👇 CORS Middleware added here
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # your React app
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class WrestlerCreate(BaseModel):
    name: str
    brand: str

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/wrestlers")
def read_wrestlers(db: Session = Depends(get_db)):
    return db.query(Wrestler).all()

@app.post("/wrestlers")
def add_wrestler(wrestler: WrestlerCreate, db: Session = Depends(get_db)):
    new_wrestler = Wrestler(name=wrestler.name, brand=wrestler.brand)
    db.add(new_wrestler)
    db.commit()
    db.refresh(new_wrestler)
    return new_wrestler

@app.put("/wrestlers/{wrestler_id}/win")
def add_win(wrestler_id: int, db: Session = Depends(get_db)):
    wrestler = db.query(Wrestler).get(wrestler_id)
    wrestler.wins += 1
    db.commit()
    return wrestler

@app.put("/wrestlers/{wrestler_id}/loss")
def add_loss(wrestler_id: int, db: Session = Depends(get_db)):
    wrestler = db.query(Wrestler).get(wrestler_id)
    wrestler.losses += 1
    db.commit()
    return wrestler

@app.delete("/wrestlers/{wrestler_id}")
def delete_wrestler(wrestler_id: int, db: Session = Depends(get_db)):
    wrestler = db.query(Wrestler).get(wrestler_id)
    db.delete(wrestler)
    db.commit()
    return {"message": "Wrestler deleted"}

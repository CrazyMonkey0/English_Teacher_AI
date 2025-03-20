from typing import Union
from fastapi import FastAPI


app = FastAPI()

AUDIO_DIR = "static/audio/"

@app.get("/")
def root():
    return {"message": "Welcome to the English Learning API"}
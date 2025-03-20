from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from app.routes.nlp import load_model_nlp, router as nlp_router
from app.routes.tts import load_model_tts
import os


app = FastAPI()

app.mount("/static", StaticFiles(directory=os.path.join(os.path.dirname(__file__), "static")), name="static")

app.state.model_nlp, app.state.tokenizer_nlp = load_model_nlp()
app.state.model_tts, app.state.tokenizer_tts, app.state.hifigan_tts = load_model_tts()

app.include_router(nlp_router, prefix="/nlp", tags=["NLP"])

app.state.AUDIO_DIR = os.path.join(os.path.dirname(__file__), "static", "audio")

@app.get("/")
def root():
    return {"message": "Welcome to the English Learning API"}
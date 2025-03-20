from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from app.routes.nlp import load_model_nlp, router as nlp_router
from app.routes.tts import load_model_tts
import os

# Initialize application
app = FastAPI()

# Mount static directory for serving static files
app.mount("/static", StaticFiles(directory=os.path.join(os.path.dirname(__file__), "static")), name="static")

# Load the pre-trained NLP 
app.state.model_nlp, app.state.tokenizer_nlp = load_model_nlp()

# Load the pre-trained TTS 
app.state.model_tts, app.state.tokenizer_tts, app.state.hifigan_tts = load_model_tts()

# Include the NLP router
app.include_router(nlp_router, prefix="/nlp", tags=["NLP"])

# Set the directory path for saving audio files
app.state.AUDIO_DIR = os.path.join(os.path.dirname(__file__), "static", "audio")


@app.get("/")
def root():
    return {"message": "Welcome to the English Learning API"}

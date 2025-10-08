from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from app.routes.nlp import load_model_nlp, router as nlp_router
from app.routes.tts import load_model_tts
from app.routes.asr import load_model_asr, router as asr_router
import os

# Initialize application
app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the pre-trained NLP 
app.state.model_nlp, app.state.tokenizer_nlp = load_model_nlp()

# Load the pre-trained TTS 
app.state.model_tts = load_model_tts()

# Load the pre-trained ASR
app.state.processor_asr, app.state.model_asr = load_model_asr()

# Include the NLP router
app.include_router(nlp_router, prefix="/nlp", tags=["NLP"])
# Include the ASR router
app.include_router(asr_router)

# Set the directory path for saving audio files
app.state.AUDIO_DIR = os.path.join(os.path.dirname(__file__), "static", "audio")
# Mount the audio directory to the /audio path
app.mount("/audio", StaticFiles(directory=app.state.AUDIO_DIR), name="audio")


@app.get("/")
def root():
    return {"message": "Welcome to the English Learning API"}

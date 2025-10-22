from fastapi import Request
from kokoro import KPipeline
import numpy as np
import soundfile as sf
import os
import uuid

# Ładowanie modelu Kokoro tylko raz przy starcie aplikacji
def load_model_tts():
    pipeline = KPipeline(lang_code='a')  # 'a' = automatyczne wykrycie języka
    return pipeline

# Funkcja generująca i zapisująca audio
def save_audio(request: Request, text: str, voice: str = 'af_heart'):
    pipeline = request.app.state.model_tts

    file_name = f"{uuid.uuid4()}.wav"
    file_path = os.path.join(request.app.state.AUDIO_DIR, file_name)
    # Initialize an empty array to merge all audio fragments
    audio_total = np.array([], dtype=np.float32)
    
    # We generate audio in streaming mode (the generator returns fragments) 
    generator = pipeline(text, voice=voice)
    for _, _, audio in generator:
        audio_total = np.concatenate([audio_total, audio])

    sf.write(file_path, audio_total, 24000)
    return f"http://127.0.0.1:8000/audio/{file_name}"
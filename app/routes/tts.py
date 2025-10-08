from fastapi import Request
from kokoro import KPipeline
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

    # unikalna nazwa pliku
    file_name = f"{uuid.uuid4()}.wav"
    file_path = os.path.join(request.app.state.AUDIO_DIR, file_name)

    # generowanie mowy
    generator = pipeline(text, voice=voice)
    for _, _, audio in generator:
        sf.write(file_path, audio, 24000)

    # zwracamy ścieżkę HTTP do pliku
    return f"http://127.0.0.1:8000/audio/{file_name}"


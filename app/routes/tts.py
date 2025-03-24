from fastapi import Request
from transformers import FastSpeech2ConformerTokenizer, FastSpeech2ConformerModel, FastSpeech2ConformerHifiGan
import soundfile as sf
import os
import uuid
import nltk

# Download necessary NLTK models (could be used later for text processing)
nltk.download('averaged_perceptron_tagger')
nltk.download('averaged_perceptron_tagger_eng')

# Load TTS 
def load_model_tts():
    model = FastSpeech2ConformerModel.from_pretrained("espnet/fastspeech2_conformer")
    tokenizer = FastSpeech2ConformerTokenizer.from_pretrained("espnet/fastspeech2_conformer")
    hifigan = FastSpeech2ConformerHifiGan.from_pretrained("espnet/fastspeech2_conformer_hifigan")
    return model, tokenizer, hifigan

# Save the generated audio file and return the file path
def save_audio(request: Request, text: str):
    model, tokenizer, hifigan = request.app.state.model_tts, request.app.state.tokenizer_tts, request.app.state.hifigan_tts

    # Generate a unique file name for the audio
    file_name = str(uuid.uuid4()) + ".wav"
    file_path = os.path.join(request.app.state.AUDIO_DIR, file_name)

    # Tokenize the input text
    inputs = tokenizer(text, return_tensors="pt")
    input_ids = inputs["input_ids"]

    # Generate the spectrogram from the model
    output_dict = model(input_ids, return_dict=True)
    spectrogram = output_dict["spectrogram"]

    # Convert the spectrogram to waveform using HiFi-GAN
    waveform = hifigan(spectrogram)

    # Save the waveform as a .wav file
    sf.write(file_path, waveform.squeeze().detach().numpy(), samplerate=22050)

    # Return the url path to the generated audio file for the frontend
    return f"http://127.0.0.1:8000/audio/{file_name}"

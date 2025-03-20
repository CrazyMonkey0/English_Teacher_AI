from fastapi import Request
from h11 import Request
from transformers import FastSpeech2ConformerTokenizer, FastSpeech2ConformerModel, FastSpeech2ConformerHifiGan
import soundfile as sf
import os
import uuid
import nltk

nltk.download('averaged_perceptron_tagger')
nltk.download('averaged_perceptron_tagger_eng')


def load_model_tts():
    model = FastSpeech2ConformerModel.from_pretrained("espnet/fastspeech2_conformer")
    tokenizer = FastSpeech2ConformerTokenizer.from_pretrained("espnet/fastspeech2_conformer")
    hifigan = FastSpeech2ConformerHifiGan.from_pretrained("espnet/fastspeech2_conformer_hifigan")
    return model, tokenizer, hifigan


def save_audio(request: Request, text:str):
    model, tokenizer, hifigan = request.app.state.model_tts, request.app.state.tokenizer_tts, request.app.state.hifigan_tts

    file_name = str(uuid.uuid4()) + ".wav"
    file_path = os.path.join(request.app.state.AUDIO_DIR, file_name)

    inputs = tokenizer(text, return_tensors="pt")
    input_ids = inputs["input_ids"]

    output_dict = model(input_ids, return_dict=True)
    spectrogram = output_dict["spectrogram"]

    waveform = hifigan(spectrogram)

    sf.write(file_path, waveform.squeeze().detach().numpy(), samplerate=22050)

    return f"/static/audio/{file_name}"

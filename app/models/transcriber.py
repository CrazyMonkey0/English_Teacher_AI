from transformers import WhisperForConditionalGeneration, WhisperProcessor
import librosa

# Loading the model and processor
processor = WhisperProcessor.from_pretrained("openai/whisper-small.en")
model = WhisperForConditionalGeneration.from_pretrained("openai/whisper-small.en")

# Audio file path
audio_file = "/"

# Loading audio file 
audio, sampling_rate = librosa.load(audio_file, sr=16000)

# Preparing input data
inputs = processor(audio, return_tensors="pt", sampling_rate=sampling_rate)
input_features = inputs["input_features"]

# Generating token IDs
output = model.generate(input_features)

# Decoding tokens into text
transcription = processor.batch_decode(output, skip_special_tokens=True)


print("Transcription:", transcription)

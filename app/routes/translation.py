from transformers import AutoModelForSeq2SeqLM, AutoTokenizer
from fastapi import APIRouter, Request
from pydantic import BaseModel
from core.rate_limit import limiter

model_name = "allegro/BiDi-eng-pol"
router = APIRouter()

class TextInput(BaseModel):
    text: str 

# Load translation model and tokenizer
def load_model_translation():
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    model = AutoModelForSeq2SeqLM.from_pretrained(model_name)
    return model, tokenizer

@router.post("/translate")
@limiter.limit("4/minute") 
async def translate_text(request: Request, text: TextInput):
    model, tokenizer = request.app.state.model_trans, request.app.state.tokenizer_trans

    # Prepare input text for translation
    text = ">>pol<< " + text.text

    # Tokenize and generate translation
    inputs = tokenizer([text], return_tensors="pt", padding=True)
    translated = model.generate(**inputs)
    decoded_translation = tokenizer.decode(translated[0], skip_special_tokens=True)

    return {"translation": decoded_translation}

from transformers import AutoModelForSeq2SeqLM, AutoTokenizer
from fastapi import APIRouter, Request

model_name = "allegro/BiDi-eng-pol"
router = APIRouter()

# Ładowanie modelu tłumaczenia
def load_model_translation():
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    model = AutoModelForSeq2SeqLM.from_pretrained(model_name)
    return model, tokenizer

@router.post("/translate")
async def translate_text(request: Request, sentence_eng: str):
    model, tokenizer = request.app.state.model_trans, request.app.state.tokenizer_trans

    # Prefiks >>pol<< informuje model, że ma tłumaczyć na polski
    text = ">>pol<< " + sentence_eng

    # Tokenizacja i generowanie tłumaczenia
    inputs = tokenizer([text], return_tensors="pt", padding=True)
    translated = model.generate(**inputs)
    decoded_translation = tokenizer.decode(translated[0], skip_special_tokens=True)

    return {"translation": decoded_translation}

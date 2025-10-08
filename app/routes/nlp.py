from transformers import AutoModelForCausalLM, AutoTokenizer
from pydantic import BaseModel
from fastapi import APIRouter, Request
from .tts import save_audio


# Model name for NLP
model_name = "Qwen/Qwen2.5-1.5B-Instruct"
router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    
# Load NLP model and tokenizer
def load_model_nlp():
    model = AutoModelForCausalLM.from_pretrained(model_name, torch_dtype="auto", device_map="auto")
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    return model, tokenizer

# Handle chat requests
@router.post("/chat")
async def chat(request: Request, message: ChatRequest):
    message = message.message
    # Get the loaded NLP model and tokenizer
    model, tokenizer = request.app.state.model_nlp, request.app.state.tokenizer_nlp
    
    # Prepare the conversation context
    messages = [
        {"role": "system", "content": "You are Qwen, created by Alibaba Cloud. You are a helpful assistant for learning English."},
        {"role": "user", "content": message},
    ]
    
    # Tokenize input and generate a response
    text = tokenizer.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)
    model_inputs = tokenizer([text], return_tensors="pt").to(model.device)
    generated_ids = model.generate(**model_inputs, max_new_tokens=512)
    
    # Decode the response
    generated_ids = [output_ids[len(input_ids):] for input_ids, output_ids in zip(model_inputs.input_ids, generated_ids)]
    response = tokenizer.batch_decode(generated_ids, skip_special_tokens=True)[0]
    
    # Save response as audio
    url_path = save_audio(request, response)

    return {"response": response, "audio": url_path}

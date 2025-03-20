from transformers import AutoModelForCausalLM, AutoTokenizer


model_name = "Qwen/Qwen2.5-1.5B-Instruct"

model = AutoModelForCausalLM.from_pretrained(
    model_name,
    torch_dtype="auto",
    device_map="auto"
)
tokenizer = AutoTokenizer.from_pretrained(model_name)

messages = [
        {"role": "system", "content": "You are Qwen, created by Alibaba Cloud. You are a helpful assistant for learning English. "+\
            "Your job is to carry on a conversation with a user in English, but if the user makes a mistake you will write him or her a correct: and here's how to get it right"},
        {"role": "user", "content": "What's your name?"},
    ]
text = tokenizer.apply_chat_template(
        messages,
        tokenize=False,
        add_generation_prompt=True
    )
model_inputs = tokenizer([text], return_tensors="pt").to(model.device)

generated_ids = model.generate(
        **model_inputs,
        max_new_tokens=512
    )
generated_ids = [
        output_ids[len(input_ids):] for input_ids, output_ids in zip(model_inputs.input_ids, generated_ids)
    ]

response = tokenizer.batch_decode(generated_ids, skip_special_tokens=True)[0]


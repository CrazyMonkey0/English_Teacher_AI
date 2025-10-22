import axios from "axios";

const API_BASE = "http://127.0.0.1:8000";

// Sending text message to NLP (bot)
export const sendMessageToBot = async (message) => {
    const response = await axios.post(`${API_BASE}/nlp/chat`, { message });
    return response.data;
};

// Sending audio to ASR (speech recognition)
export const sendAudioToASR = async (audioBlob) => {
    const formData = new FormData();
    formData.append("audio", audioBlob, `${Date.now()}.wav`);
    const response = await axios.post(`${API_BASE}/asr`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
};

// Combination of ASR + NLP (audio -> text -> bot response)
export const sendAudioMessageToBot = async (audioBlob) => {
    const asrResult = await sendAudioToASR(audioBlob);
    const transcription = asrResult.transcription;

    const botReply = await sendMessageToBot(transcription);

    return {
        transcription,
        ...botReply
    };
};
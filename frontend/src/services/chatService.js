import api from "./api";

export const sendMessageToBot = async (message) => {
    const response = await api.post("/nlp/chat", { message });
    return response.data;
};

// Sending audio to ASR (speech recognition)
export const sendAudioToASR = async (audioBlob) => {
    const formData = new FormData();
    formData.append("audio", audioBlob, `${Date.now()}.wav`);
    const response = await api.post("/asr", formData, {
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
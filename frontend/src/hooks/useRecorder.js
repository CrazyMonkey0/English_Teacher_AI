import { useState, useRef } from "react";

export function useRecorder() {
    const [isRecording, setIsRecording] = useState(false);
    const [audioURL, setAudioURL] = useState(null);
    const [audioBlob, setAudioBlob] = useState(null);
    const mediaRecorder = useRef(null);
    const audioChunks = useRef([]);

    const startRecording = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder.current = new MediaRecorder(stream);
        audioChunks.current = [];

        mediaRecorder.current.ondataavailable = (e) => audioChunks.current.push(e.data);
        mediaRecorder.current.onstop = () => {
            const blob = new Blob(audioChunks.current, { type: "audio/wav" });
            setAudioURL(URL.createObjectURL(blob));
            setAudioBlob(blob);
        };

        mediaRecorder.current.start();
        setIsRecording(true);
    };

    const stopRecording = () => {
        mediaRecorder.current.stop();
        setIsRecording(false);
    };

    const clearRecording = () => {
        setAudioURL(null);
        setAudioBlob(null);
        audioChunks.current = [];
    };

    const getAudioBlob = async () => audioBlob;

    return { isRecording, audioURL, audioBlob, startRecording, stopRecording, clearRecording, getAudioBlob };
}

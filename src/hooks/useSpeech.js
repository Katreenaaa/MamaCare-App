import { useState, useRef, useCallback, useEffect } from "react";

export function useSpeech(language = "en-NG") {
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState([]);
  const recognitionRef = useRef(null);

  // Robustly load available browser voices
  useEffect(() => {
    const updateVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      if (availableVoices.length > 0) {
        setVoices(availableVoices);
      }
    };

    updateVoices(); // Initial check

    // This is for if Chrome/Safari load voices asynchronously
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, []);

  // Text-to-Speech (TTS)
  const speak = useCallback(
    (text, langCode = language) => {
      if (!("speechSynthesis" in window)) return;

      // Stop any ongoing speech before starting a new one
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = langCode;
      utterance.rate = 0.92;
      utterance.pitch = 1.1;

      // === SMART VOICE SELECTION ===
      if (voices.length > 0) {
        // 1. Try to find the exact language match (e.g., yo-NG)
        let possibleVoices = voices.filter(
          (v) => v.lang.replace("_", "-") === langCode,
        );

        // 2. If no local dialect is installed, fallback to Nigerian English (en-NG)
        if (possibleVoices.length === 0) {
          possibleVoices = voices.filter(
            (v) => v.lang.includes("NG") || v.lang.includes("ng"),
          );
        }

        // 3. If no Nigerian voice exists, fallback to standard Female voices
        if (possibleVoices.length === 0) {
          possibleVoices = voices.filter(
            (v) =>
              v.name.toLowerCase().includes("female") ||
              v.name.includes("Zira") || // Windows standard female
              v.name.includes("Samantha") || // Mac standard female
              v.name.includes("Google UK English Female"),
          );
        }

        // 4. Finally, try to specifically pick a female voice from the filtered list
        let selectedVoice =
          possibleVoices.find((v) => v.name.toLowerCase().includes("female")) ||
          possibleVoices[0];

        if (selectedVoice) {
          utterance.voice = selectedVoice;
        }
      }

      // Track speaking state for the Mute button
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    },
    [language, voices],
  );

  // Function to stop/mute ongoing speech
  const stopSpeech = useCallback(() => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  // Speech-to-Text (STT)
  const startRecording = useCallback(
    (onResult, onEnd) => {
      if (
        !("webkitSpeechRecognition" in window || "SpeechRecognition" in window)
      ) {
        alert("Voice input not supported in this browser.");
        return;
      }

      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();

      recognitionRef.current.lang = language;
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (e) => {
        let finalTranscript = "";
        let interimTranscript = "";

        for (let i = e.resultIndex; i < e.results.length; i++) {
          if (e.results[i].isFinal) {
            finalTranscript += e.results[i][0].transcript;
          } else {
            interimTranscript += e.results[i][0].transcript;
          }
        }
        onResult({ finalTranscript, interimTranscript });
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
        if (onEnd) onEnd();
      };

      recognitionRef.current.start();
      setIsRecording(true);
    },
    [language],
  );

  const stopRecording = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  }, []);

  return {
    speak,
    stopSpeech,
    isSpeaking,
    startRecording,
    stopRecording,
    isRecording,
  };
}

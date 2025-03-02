import React, { useEffect, useState, useRef } from "react";
import styles from "./Assistant.module.css";

const Assistant = () => {
  const [audioData, setAudioData] = useState(new Uint8Array(20));
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");
  const [isListening, setIsListening] = useState(false);
  
  const recognitionRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationIdRef = useRef(null);

  useEffect(() => {
    let dataArray;

    // **Initialize Speech Recognition**
    const initSpeechRecognition = () => {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        console.error("Speech recognition not supported");
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US"; // Ensure it captures English speech properly

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => {
        setIsListening(false);
        // Restart recognition automatically
        setTimeout(() => recognition.start(), 500);
      };

      recognition.onresult = async (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join("");

        setTranscript(transcript);

        if (event.results[0].isFinal) {
          sendToAssistant(transcript); // Send only finalized text to API
        }
      };

      recognition.start();
      recognitionRef.current = recognition;
    };

    // **Initialize Audio Visualization**
    const initAudio = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const analyser = audioContext.createAnalyser();
        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);

        analyser.fftSize = 1024;
        analyser.smoothingTimeConstant = 0.4;
        dataArray = new Uint8Array(analyser.frequencyBinCount);

        audioContextRef.current = audioContext;
        analyserRef.current = analyser;

        const updateAudioData = () => {
          analyser.getByteFrequencyData(dataArray);
          const samples = new Uint8Array(60);

          const avgAudio = dataArray.reduce((sum, val) => sum + val, 0) / dataArray.length;
          for (let i = 0; i < 60; i++) {
            const value = dataArray[i * 4];
            const sinWave = Math.sin(Date.now() * 0.008 + i * 0.5) * 25;
            const audioInfluence = (value / 255) * 20;
            samples[i] = avgAudio > 1 ? 50 + sinWave + audioInfluence : 50;
          }

          setAudioData(samples);
          animationIdRef.current = requestAnimationFrame(updateAudioData);
        };

        updateAudioData();
      } catch (err) {
        console.error("Error accessing microphone:", err);
      }
    };

    initAudio();
    initSpeechRecognition();

    return () => {
      if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
      if (audioContextRef.current) audioContextRef.current.close();
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, []);

  // **Send Speech to Flask Assistant**
  const sendToAssistant = async (text) => {
    try {
      const response = await fetch("http://localhost:5000/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: text }),
      });
      const data = await response.json();
      setResponse(data.reply);
    } catch (error) {
      console.error("Error fetching assistant response:", error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.waveContainer}>
        {[...Array(59)].map((_, index) => (
          <div
            key={index}
            className={styles.line}
            style={{
              transform: `translate(0, ${audioData[index]}px)`,
              height: "3px",
              width: "2px",
              marginLeft: "2px",
            }}
          />
        ))}
      </div>

      <div className={styles.transcriptContainer}>
        <p>{transcript || "Speak something..."}</p>
        <div className={styles.status}>{isListening ? "Listening..." : "Not listening"}</div>
        {response && (
          <div className={styles.response}>
            <p><strong>Assistant:</strong> {response}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Assistant;

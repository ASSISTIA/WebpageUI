import React, { useEffect, useState } from 'react';
import styles from './Assistant.module.css';

const Assistant = () => {
  const [audioData, setAudioData] = useState(new Uint8Array(20));
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    let audioContext;
    let analyser;
    let dataArray;
    let animationId;
    let recognition;

    const initSpeechRecognition = () => {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        console.error('Speech recognition not supported');
        return;
      }

      recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      
      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
        setTranscript(transcript);
      };

      recognition.start();
    };

    const initAudio = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioContext = new AudioContext();
        analyser = audioContext.createAnalyser();
        const source = audioContext.createMediaStreamSource(stream);
        
        source.connect(analyser);
        analyser.fftSize = 1024;
        analyser.minDecibels = -90;
        analyser.maxDecibels = -10;
        analyser.smoothingTimeConstant = 0.4;

        dataArray = new Uint8Array(analyser.frequencyBinCount);
        
        const updateAudioData = () => {
          analyser.getByteFrequencyData(dataArray);
          const samples = new Uint8Array(60);
          
          const avgAudio = dataArray.reduce((sum, val) => sum + val, 0) / dataArray.length;
          
          for (let i = 0; i < 60; i++) {
            const value = dataArray[i * 4];
            if (avgAudio > 1) {
              const sinWave = Math.sin(Date.now() * 0.008 + i * 0.5) * 25;
              const audioInfluence = (value / 255) * 20;
              samples[i] = 50 + sinWave + audioInfluence;
            } else {
              samples[i] = 50;
            }
          }
          setAudioData(samples);
          animationId = requestAnimationFrame(updateAudioData);
        };
        
        updateAudioData();
      } catch (err) {
        console.error('Error accessing microphone:', err);
      }
    };

    initAudio();
    initSpeechRecognition();

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
      if (audioContext) audioContext.close();
      if (recognition) recognition.stop();
    };
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.waveContainer}>
        {[...Array(59)].map((_, index) => (
          <div 
            key={index} 
            className={styles.line}
            style={{ 
              transform: `translate(0, ${audioData[index]}px)`,
              height: '3px',
              width: '2px',
              marginLeft: '2px',
            }}
          />
        ))}
      </div>
      
      <div className={styles.transcriptContainer}>
        <p>{transcript || 'Speak something...'}</p>
        <div className={styles.status}>
          {isListening ? 'Listening...' : 'Not listening'}
        </div>
      </div>
    </div>
  );
};

export default Assistant;
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./HeartBeat.css";

const HeartBeat = () => {
  const [heartbeat, setHeartbeat] = useState(0);
  const [spo2, setSpo2] = useState(0);
  const [glucose, setGlucose] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchSensorData = async () => {
    try {
      const response = await axios.get("http://192.168.250.132:5001/data");
      setHeartbeat(response.data.heartbeat);
      setSpo2(response.data.spo2);
      setGlucose(response.data.glucose);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching sensor data:", error);
    }
  };

  useEffect(() => {
    const interval = setInterval(fetchSensorData, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dashboard-container">
      <div className="heart-animation-container">
        <div className="heart"></div>
      </div>
      <div className="data-display">
        <h1>Pulse Oximeter Monitor</h1>
        {loading ? (
          <p className="loading-text">Loading data...</p>
        ) : (
          <div className="data-container">
            <p className="data-text">
              <strong>Heart Rate:</strong> {heartbeat} BPM
            </p>
            <p className="data-text">
              <strong>SpO₂:</strong> {spo2} %
            </p>
            <p className="data-text">
              <strong>Glucose:</strong> {glucose} mg/dL
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeartBeat;
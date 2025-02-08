import React, { useState, useEffect } from "react";
import { FaHeartbeat, FaLungs, FaTint, FaHome } from "react-icons/fa";
import "./HeartBeat.css";
import { useNavigate } from "react-router-dom";

const HeartBeat = () => {
  const navigate = useNavigate();
  const [vitals, setVitals] = useState({
    heartbeat: 78,
    spo2: 98,
    glucose: 98
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchVitals = async () => {
    try {
      const response = await fetch("http://172.16.14.66:5001/data");
      const data = await response.json();
      setVitals(data);
      setLoading(false);
    } catch (err) {
      setError("Unable to fetch vital signs. Please try again later.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVitals();
    const vitalsInterval = setInterval(fetchVitals, 2000);
    return () => clearInterval(vitalsInterval);
  }, []);

  const MetricCard = ({ title, value, unit, icon }) => (
    <div className="metric-card">
      <div className="metric-content">
        <h3 className="metric-title">{title}</h3>
        <div className="metric-value">
          {icon}
          <span>{value}</span>
          <span className="metric-unit">{unit}</span>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="aspect-ratio-container">
          <div className="loading-container">
            <div className="loading-spinner" />
            <p>Loading vital signs...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="aspect-ratio-container">
          <div className="error-container">
            <p>{error}</p>
            <button onClick={fetchVitals} className="backButton">
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="aspect-ratio-container">
        <header className="header">
          <div className="pageTitle">
            <button onClick={() => navigate("/")} className="backButton">
              <FaHome />
            </button>
            <h1>Vital Signs Monitor</h1>
          </div>
        </header>

        <main className="dashboard-content">
          <section className="visual-section">
            <FaHeartbeat className="heart-icon" />
          </section>

          <section className="metrics-section">
            <MetricCard
              title="Heart Rate"
              value={vitals.heartbeat}
              unit="BPM"
              icon={<FaHeartbeat />}
            />
            <MetricCard
              title="Blood Oxygen"
              value={vitals.spo2}
              unit="%"
              icon={<FaLungs />}
            />
            <MetricCard
              title="Glucose Level"
              value={vitals.glucose}
              unit="mg/dL"
              icon={<FaTint />}
            />
          </section>
        </main>
      </div>
    </div>
  );
};

export default HeartBeat;
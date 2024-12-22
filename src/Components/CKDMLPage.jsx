import React, { useState } from 'react';
import PatientInfoForm from './PatientInfoForm';
import './CKDMLStyles.css';  

const CKDMLPage = () => {
    const [patientInfo, setPatientInfo] = useState(null);
    const [formData, setFormData] = useState({
      bloodPressure: '',
      sg: '',
      hypertension: 'no'
    });
    const [result, setResult] = useState(null);
  
    const handleInputChange = (e) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      setResult("CKD analysis result would appear here");
    };
  
    return (
      <div className="ckd-container">
        <h1>Chronic Kidney Disease Analysis</h1>
        {!patientInfo ? (
          <PatientInfoForm onInfoSubmit={setPatientInfo} />
        ) : (
          <div className="form-container">
            <div className="patient-details">
              <p>Patient: {patientInfo.name}</p>
              <p>Age: {patientInfo.age}</p>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Blood Pressure:</label>
                <input
                  type="number"
                  name="bloodPressure"
                  value={formData.bloodPressure}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Specific Gravity (SG):</label>
                <input
                  type="number"
                  name="sg"
                  value={formData.sg}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Hypertension:</label>
                <select
                  name="hypertension"
                  value={formData.hypertension}
                  onChange={handleInputChange}
                >
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </div>
              <button type="submit">
                Analyze Data
              </button>
            </form>
            {result && (
              <div className="result-section">
                <h3>Analysis Result:</h3>
                <p>{result}</p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

export default CKDMLPage;

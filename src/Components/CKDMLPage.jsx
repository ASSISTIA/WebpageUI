import React, { useState } from 'react';
import { ref, set } from "firebase/database";
import { database } from '../firebase'; // Ensure Firebase is correctly configured and imported
import PatientInfoForm from './PatientInfoForm';
import './CKDMLStyles.css';  

const CKDMLPage = () => {
    const [patientInfo, setPatientInfo] = useState(null);
    const [inputs, setInputs] = useState({
        hemoglobin: '',
        specific_gravity: '',
        hypertension: 'no'
      });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const handleChange = (e) => {
      setInputs(prev => ({
        ...prev,
       [e.target.name]: e.target.value
      }));
    };

    const handlePatientInfoSubmit = async (info) => {
        try {
            // Save patient info under the "CKD" category in the database
            const dbRef = ref(database, "CKD"); // Overwrite existing data in "CKD" category
            await set(dbRef, {
                name: info.name,
                age: info.age
            });
            setPatientInfo(info); // Update local state with patient info
            console.log("Patient information saved successfully under 'CKD' category!");
        } catch (error) {
            console.error("Error saving patient information:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
    
        try {
            // Validate inputs before sending
            if (!inputs.hemoglobin || !inputs.specific_gravity) {
                throw new Error('Please fill in all required fields');
            }

            const apiData = {
                hemoglobin: parseFloat(inputs.hemoglobin),
                specific_gravity: parseFloat(inputs.specific_gravity),
                hypertension: inputs.hypertension === 'yes' ? 1 : 0
            };
    
            // Direct API call without cors-anywhere
            const response = await fetch('https://ckd-prediction-s8qx.onrender.com/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(apiData)
            });
    
            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }
    
            const data = await response.json();
            setResult(data);
        } catch (err) {
            setError(`Failed to get prediction: ${err.message}`);
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="ckd-container">
            <h1>Chronic Kidney Disease Analysis</h1>
            {!patientInfo ? (
                <PatientInfoForm onInfoSubmit={handlePatientInfoSubmit} />
            ) : (
                <div className="content-area">
                    <div className="patient-details">
                        <p>Patient: {patientInfo.name}</p>
                        <p>Age: {patientInfo.age}</p>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="input-section">
                        <div className="form-group">
                            <label htmlFor="hemoglobin">Hemoglobin Level:</label>
                            <input
                                id="hemoglobin"
                                type="number"
                                name="hemoglobin"
                                value={inputs.hemoglobin}
                                onChange={handleChange}
                                step="0.1"
                                required
                                placeholder="Enter hemoglobin level"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="specific_gravity">Specific Gravity:</label>
                            <input
                                id="specific_gravity"
                                type="number"
                                name="specific_gravity"
                                value={inputs.specific_gravity}
                                onChange={handleChange}
                                step="0.001"
                                required
                                placeholder="Enter specific gravity"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="hypertension">Hypertension:</label>
                            <select
                                id="hypertension"
                                name="hypertension"
                                value={inputs.hypertension}
                                onChange={handleChange}
                            >
                                <option value="no">No</option>
                                <option value="yes">Yes</option>
                            </select>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="analyze-btn"
                        >
                            {loading ? 'Analyzing...' : 'Get Prediction'}
                        </button>
                    </form>

                    {error && (
                        <div className="error-section">
                            <p>⚠️ {error}</p>
                        </div>
                    )}

                    {result && (
                        <div className="result-section">
                            <h3>Analysis Result:</h3>
                            <div className="result-details">
                                <p>Status: {result.has_ckd ? 'CKD Detected' : 'No CKD Detected'}</p>
                                <p>Probability: {(result.probability * 100).toFixed(2)}%</p>
                                <p>Analysis: {result.message}</p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CKDMLPage;

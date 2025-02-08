import React, { useState } from 'react';
import { ref, set } from "firebase/database";
import { database } from '../firebase';
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
            const dbRef = ref(database, "Kidney");
            await set(dbRef, {
                name: info.name,
                age: info.age,
                email: info.email,
                sex: info.sex
            });
            setPatientInfo(info);
        } catch (error) {
            console.error("Error saving patient information:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (!inputs.hemoglobin || !inputs.specific_gravity) {
                throw new Error('Please fill in all required fields');
            }

            const apiData = {
                hemoglobin: parseFloat(inputs.hemoglobin),
                specific_gravity: parseFloat(inputs.specific_gravity),
                hypertension: inputs.hypertension === 'yes' ? 1 : 0
            };

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

            const dbRef = ref(database, "Kidney");
            await set(dbRef, {
                name: patientInfo.name,
                age: patientInfo.age,
                result: data.message
            });

        } catch (err) {
            setError(`Failed to get prediction: ${err.message}`);
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="ckd-container">
            <div className="ckd-header">
                <h1>Chronic Kidney Disease Analysis</h1>
                <p className="header-subtitle">Advanced Medical Diagnostic Tool</p>
            </div>

            {!patientInfo ? (
                <div className="initial-form-container">
                    <PatientInfoForm onInfoSubmit={handlePatientInfoSubmit} />
                </div>
            ) : (
                <div className="analysis-content">
                    <div className="patient-card">
                        <h3>Patient Information</h3>
                        <div className="patient-info-grid">
                            <div className="info-item">
                                <span className="info-label">Name:</span>
                                <span className="info-value">{patientInfo.name}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Age:</span>
                                <span className="info-value">{patientInfo.age}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Email:</span>
                                <span className="info-value">{patientInfo.email}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Sex:</span>
                                <span className="info-value">{patientInfo.sex}</span>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="analysis-form">
                        <h3>Medical Parameters</h3>
                        <div className="form-grid">
                            <div className="form-group">
                                <label htmlFor="hemoglobin">Hemoglobin Level (g/dL)</label>
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
                                <label htmlFor="specific_gravity">Specific Gravity</label>
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
                                <label htmlFor="hypertension">Hypertension Status</label>
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
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className={`submit-button ${loading ? 'loading' : ''}`}
                        >
                            {loading ? 'Analyzing...' : 'Generate Analysis'}
                        </button>
                    </form>

                    {error && (
                        <div className="error-message">
                            <span className="error-icon">⚠️</span>
                            <p>{error}</p>
                        </div>
                    )}

                    {result && (
                        <div className={`result-card ${result.has_ckd ? 'warning' : 'success'}`}>
                            <h3>Analysis Results</h3>
                            <div className="result-content">
                                <div className="result-item">
                                    <span className="result-label">Status:</span>
                                    <span className="result-value">
                                        {result.has_ckd ? 'CKD Detected' : 'No CKD Detected'}
                                    </span>
                                </div>
                                <div className="result-item">
                                    <span className="result-label">Probability:</span>
                                    <span className="result-value">
                                        {(result.probability * 100).toFixed(2)}%
                                    </span>
                                </div>
                                <div className="result-item full-width">
                                    <span className="result-label">Analysis:</span>
                                    <span className="result-value">{result.message}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CKDMLPage;
import React, { useState } from 'react';
import { ref, set } from "firebase/database";
import { database } from '../firebase';
import PatientInfoForm from './PatientInfoForm';
import './CKDMLStyles.css';
import axios from 'axios';

const DiabetesPredictionPage = () => {
    const [patientInfo, setPatientInfo] = useState(null);
    const [inputs, setInputs] = useState({
        gender: '',
        age: '',
        hypertension: 0,
        heart_disease: 0,
        smoking_history: '',
        bmi: '',
        HbA1c_level: '',
        blood_glucose_level: ''
    });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const value = e.target.type === 'number' ? 
            parseFloat(e.target.value) || '' : 
            e.target.value;
            
        setInputs(prev => ({
            ...prev,
            [e.target.name]: value
        }));
    };

    const handlePatientInfoSubmit = async (info) => {
        try {
            const dbRef = ref(database, "Diabetes");
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
            if ( !inputs.bmi || !inputs.HbA1c_level || !inputs.blood_glucose_level) {
                throw new Error('Please fill in all required fields');
            }

            const apiData = {
                ...inputs,
                age: parseFloat(patientInfo.age), // Fixed: Changed from info.name to patientInfo.age
                bmi: parseFloat(inputs.bmi),
                HbA1c_level: parseFloat(inputs.HbA1c_level),
                blood_glucose_level: parseFloat(inputs.blood_glucose_level),
                hypertension: parseInt(inputs.hypertension),
                heart_disease: parseInt(inputs.heart_disease)
            };

            const response = await axios.post('https://diabetes-model-oet7.onrender.com/predict', apiData);
            setResult(response.data);

            // Save results to Firebase
            const dbRef = ref(database, "Diabetes");
            await set(dbRef, {
                ...patientInfo,
                result: response.data.prediction,
                confidence: response.data.confidence
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
                <h1>Diabetes Prediction</h1>
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
                            {/* <div className="form-group">
                                <label htmlFor="gender">Gender</label>
                                <select
                                    id="gender"
                                    name="gender"
                                    value={inputs.gender}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Female">Female</option>
                                    <option value="Male">Male</option>
                                </select>
                            </div> */}

                            <div className="form-group">
                                <label htmlFor="hypertension">Hypertension</label>
                                <select
                                    id="hypertension"
                                    name="hypertension"
                                    value={inputs.hypertension}
                                    onChange={handleChange}
                                >
                                    <option value={0}>No</option>
                                    <option value={1}>Yes</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="heart_disease">Heart Disease</label>
                                <select
                                    id="heart_disease"
                                    name="heart_disease"
                                    value={inputs.heart_disease}
                                    onChange={handleChange}
                                >
                                    <option value={0}>No</option>
                                    <option value={1}>Yes</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="smoking_history">Smoking History</label>
                                <select
                                    id="smoking_history"
                                    name="smoking_history"
                                    value={inputs.smoking_history}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Smoking History</option>
                                    <option value="never">Never</option>
                                    <option value="No Info">No Info</option>
                                    <option value="current">Current</option>
                                    <option value="former">Former</option>
                                    <option value="ever">Ever</option>
                                    <option value="not current">Not Current</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="bmi">BMI</label>
                                <input
                                    id="bmi"
                                    type="number"
                                    name="bmi"
                                    value={inputs.bmi}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter BMI"
                                    step="0.01"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="HbA1c_level">HbA1c Level</label>
                                <input
                                    id="HbA1c_level"
                                    type="number"
                                    name="HbA1c_level"
                                    value={inputs.HbA1c_level}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter HbA1c level"
                                    step="0.1"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="blood_glucose_level">Blood Glucose Level</label>
                                <input
                                    id="blood_glucose_level"
                                    type="number"
                                    name="blood_glucose_level"
                                    value={inputs.blood_glucose_level}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter blood glucose level"
                                />
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className={`submit-button ${loading ? 'loading' : ''}`}
                        >
                            {loading ? 'Analyzing...' : 'Generate Prediction'}
                        </button>
                    </form>

                    {error && (
                        <div className="error-message">
                            <span className="error-icon">⚠️</span>
                            <p>{error}</p>
                        </div>
                    )}

                    {result && (
                        <div className={`result-card ${result.prediction === 'Diabetic' ? 'warning' : 'success'}`}>
                            <h3>Prediction Results</h3>
                            <div className="result-content">
                                <div className="result-item">
                                    <span className="result-label">Status:</span>
                                    <span className="result-value">
                                        {result.prediction}
                                    </span>
                                </div>
                                {result.confidence && (
                                    <div className="result-item">
                                        <span className="result-label">Confidence:</span>
                                        <span className="result-value">
                                            {(result.confidence * 100).toFixed(2)}%
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default DiabetesPredictionPage;
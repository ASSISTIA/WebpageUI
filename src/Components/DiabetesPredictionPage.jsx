import React, { useState } from 'react';
import { ref, set } from "firebase/database";
import { database } from '../firebase';
import './CKDMLStyles.css';
import axios from 'axios'; // Import axios for API requests

const DiabetesPredictionPage = () => {
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
        setInputs(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Send data as JSON to the API
            const response = await axios.post('http://192.168.1.2:8000/api/predict', inputs);
            setResult(response.data);

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

            <form onSubmit={handleSubmit} className="analysis-form">
                <h3>Patient Information</h3>
                <div className="form-grid">
                    {/* Input fields for patient data */}
                    <div className="form-group">
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
                    </div>

                    <div className="form-group">
                        <label htmlFor="age">Age</label>
                        <input
                            id="age"
                            type="number"
                            name="age"
                            value={inputs.age}
                            onChange={handleChange}
                            required
                            placeholder="Enter age"
                        />
                    </div>

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
                        <input
                            id="smoking_history"
                            type="text"
                            name="smoking_history"
                            value={inputs.smoking_history}
                            onChange={handleChange}
                            placeholder="Enter smoking history"
                        />
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
                <div className={`result-card ${result.prediction ? 'warning' : 'success'}`}>
                    <h3>Prediction Results</h3>
                    <div className="result-content">
                        <div className="result-item">
                            <span className="result-label">Prediction:</span>
                            <span className="result-value">
                                {result.prediction ? 'Diabetic' : 'Non-diabetic'}
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DiabetesPredictionPage; 
import React, { useState } from 'react';
import { ref, set } from "firebase/database";
import { database } from '../firebase'; // Ensure Firebase is correctly configured and imported
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

    const handlePatientInfoSubmit = async (info) => {
        // Save patient info under the "Kidney" category in the database
        try {
            const dbRef = ref(database, "Kidney"); // Overwrite existing patient in "Kidney" category
            await set(dbRef, {
                name: info.name,
                age: info.age
            });
            setPatientInfo(info); // Update local state with patient info
            console.log("Patient information saved successfully under 'Kidney' category!");
        } catch (error) {
            console.error("Error saving patient information:", error);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setResult("CKD analysis result would appear here");
    };

    return (
        <div className="ckd-container">
            <h1>Chronic Kidney Disease Analysis</h1>
            {!patientInfo ? (
                <PatientInfoForm onInfoSubmit={handlePatientInfoSubmit} />
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

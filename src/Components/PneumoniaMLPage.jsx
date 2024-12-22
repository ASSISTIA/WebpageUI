import React, { useState } from 'react';
import PatientInfoForm from './PatientInfoForm';
import './PneumoniaMLStyles.css'; 
const PneumoniaMLPage = () => {
    const [patientInfo, setPatientInfo] = useState(null);
    const [image, setImage] = useState(null);
    const [result, setResult] = useState(null);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        setImage(file);
    };

    const handleSubmit = () => {
        setResult("Pneumonia analysis result would appear here");
    };

    return (
        <div className="pneumonia-container">
            <h1>Pneumonia Detection Model</h1>
            {!patientInfo ? (
                <PatientInfoForm onInfoSubmit={setPatientInfo} />
            ) : (
                <div className="content-area">
                    <div className="patient-details">
                        <p>Patient: {patientInfo.name}</p>
                        <p>Age: {patientInfo.age}</p>
                    </div>
                    <div className="upload-section">
                        <label htmlFor="file-upload">Upload Chest X-Ray:</label>
                        <input
                            id="file-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                        />
                    </div>
                    {image && (
                        <button onClick={handleSubmit} className="analyze-btn">
                            Analyze Image
                        </button>
                    )}
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

export default PneumoniaMLPage;

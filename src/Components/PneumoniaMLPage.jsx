import React, { useState } from 'react';
import { ref, set } from "firebase/database";
import { database } from '../firebase'; // Ensure Firebase is correctly configured and imported
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

    const handlePatientInfoSubmit = async (info) => {
        // Save patient info under the "Pneumonia" category in the database
        try {
            const dbRef = ref(database, "Pneumonia"); // Overwrite existing data in "Pneumonia" category
            await set(dbRef, {
                name: info.name,
                age: info.age,
                email: info.email,
                sex: info.sex
            });
            setPatientInfo(info); // Update local state with patient info
            console.log("Patient information saved successfully under 'Pneumonia' category!");
        } catch (error) {
            console.error("Error saving patient information:", error);
        }
    };

    const handleSubmit = () => {
        setResult("Pneumonia analysis result would appear here");
    };

    return (
        <div className="pneumonia-container">
            <h1>Pneumonia Detection Model</h1>
            {!patientInfo ? (
                <PatientInfoForm onInfoSubmit={handlePatientInfoSubmit} />
            ) : (
                <div className="content-area">
                    <div className="patient-details">
                        <p>Patient: {patientInfo.name}</p>
                        <p>Age: {patientInfo.age}</p>
                        <p>Email: {patientInfo.email}</p>
                        <p>Sex: {patientInfo.sex}</p>
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

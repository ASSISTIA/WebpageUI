import React, { useState } from 'react';
import { ref, set } from "firebase/database";
import { database } from '../firebase';
import PatientInfoForm from './PatientInfoForm';
import './Brain.css';
import emailjs from "emailjs-com";


const BrainMLPage = () => {
    const [patientInfo, setPatientInfo] = useState(null);
    const [image, setImage] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        setImage(file);
    };

    const handlePatientInfoSubmit = async (info) => {
        try {
            const dbRef = ref(database, "BrainTumor");
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

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);

        try {
            if (!image) {
                throw new Error('Please select an image');
            }

            const formData = new FormData();
            formData.append('file', image);

            const response = await fetch('https://braintumor-rsk8.onrender.com/predict/brain', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            const data = await response.json();
            setResult(data);

            const dbRef = ref(database, "BrainTumor");
            await set(dbRef, {
                ...patientInfo,
                result: data.prediction || data.class_name
            });
            const emailParams = {
                name: patientInfo.name,
                age: patientInfo.age,
                sex: patientInfo.sex,
                email: patientInfo.email,
                detection_type: "Brain Tumor",
                result: data.prediction || data.class_name,
                additional_details: `Confidence: ${((data.confidence || 0) * 100).toFixed(2)}%`
            };
            
            emailjs.send('service_w6gnwr2', 'template_x1jsmbb', emailParams, '-zYnQ129XMEcAUHA3')
                .then((emailResponse) => {
                    console.log('Brain Tumor Email sent successfully!', emailResponse.status, emailResponse.text);
                })
                .catch((emailError) => {
                    console.error('Failed to send Brain Tumor result email.', emailError);
                });
            

        } catch (err) {
            setError(`Failed to analyze image: ${err.message}`);
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="analysis-container">
            <div className="analysis-header">
                <h1>Brain ML Model Analysis</h1>
                <p>Advanced neural network analysis for brain scan images</p>
            </div>

            {!patientInfo ? (
                <PatientInfoForm onInfoSubmit={handlePatientInfoSubmit} />
            ) : (
                <div className="analysis-content">
                    <div className="patient-card">
                        <div className="patient-info-grid">
                            <div className="patient-info-item">
                                <div className="patient-info-label">Patient Name</div>
                                <div className="patient-info-value">{patientInfo.name}</div>
                            </div>
                            <div className="patient-info-item">
                                <div className="patient-info-label">Age</div>
                                <div className="patient-info-value">{patientInfo.age} years</div>
                            </div>
                            <div className="patient-info-item">
                                <div className="patient-info-label">Email</div>
                                <div className="patient-info-value">{patientInfo.email}</div>
                            </div>
                            <div className="patient-info-item">
                                <div className="patient-info-label">Sex</div>
                                <div className="patient-info-value">{patientInfo.sex}</div>
                            </div>
                        </div>
                    </div>

                    <div className="upload-section">
                        <h3>Upload Brain Scan Image</h3>
                        <div className="file-input-container">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="file-input"
                            />
                        </div>
                        {image && (
                            <button
                                className="analyze-button"
                                onClick={handleSubmit}
                                disabled={loading}
                            >
                                {loading ? 'Analyzing...' : 'Analyze Image'}
                            </button>
                        )}
                    </div>

                    {error && (
                        <div className="error-message">
                            ⚠️ {error}
                        </div>
                    )}

                    {result && (
                        <div className="result-card">
                            <div className="result-header">Analysis Result</div>
                            <div className="result-item">
                                <div className="result-label">Classification</div>
                                <div className="result-value">
                                    {result.prediction || result.class_name}
                                </div>
                            </div>
                            <div className="result-item">
                                <div className="result-label">Confidence</div>
                                <div className="result-value">
                                    {((result.confidence || result.probability || 0) * 100).toFixed(2)}%
                                </div>
                            </div>
                            <div className="raw-response">
                                {JSON.stringify(result, null, 2)}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default BrainMLPage;
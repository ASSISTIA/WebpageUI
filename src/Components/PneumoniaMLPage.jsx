import React, { useState } from "react";
import { ref, set } from "firebase/database";
import { database } from "../firebase"; // Ensure Firebase is correctly configured and imported
import PatientInfoForm from "./PatientInfoForm";
import emailjs from "emailjs-com";
import "./PneumoniaMLStyles.css";

const PneumoniaMLPage = () => {
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
    // Save patient info under the "Pneumonia" category in the database
    try {
      const dbRef = ref(database, "Pneumonia"); // Overwrite existing data in "Pneumonia" category
      await set(dbRef, {
        name: info.name,
        age: info.age,
        email: info.email,
        sex: info.sex,
      });
      setPatientInfo(info); // Update local state with patient info
      console.log(
        "Patient information saved successfully under 'Pneumonia' category!"
      );
    } catch (error) {
      console.error("Error saving patient information:", error);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      if (!image) {
        throw new Error("Please select an image");
      }

      const formData = new FormData();
      formData.append("file", image);

      const response = await fetch("http://localhost:10000/predict/pneumonia", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      setResult(data);

      const dbRef = ref(database, "Pneumonia");
      await set(dbRef, {
        ...patientInfo,
        result: data.prediction || data.class_name,
      });

      // Send result email
      const emailParams = {
        name: patientInfo.name,
        age: patientInfo.age,
        sex: patientInfo.sex,
        email: patientInfo.email,
        detection_type: "Pneumonia", // Change accordingly: Pneumonia, Brain Tumor, CKD, Diabetes
        result: data.prediction || data.class_name,
        additional_details: `Confidence: ${(data.confidence * 100).toFixed(2)}%`
    };
    
      

      emailjs
        .send(
          "service_w6gnwr2",
          "template_x1jsmbb",
          emailParams,
          "-zYnQ129XMEcAUHA3"
        )
        .then((emailResponse) => {
          console.log(
            "Email successfully sent!",
            emailResponse.status,
            emailResponse.text
          );
        })
        .catch((emailError) => {
          console.error("Failed to send result email.", emailError);
        });
    } catch (err) {
      setError(`Failed to analyze image: ${err.message}`);
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
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
            <button
              onClick={handleSubmit}
              className="analyze-btn"
              disabled={loading}
            >
              {loading ? "Analyzing..." : "Analyze Image"}
            </button>
          )}
          {error && <div className="error-message">⚠️ {error}</div>}
          {result && (
            <div className="result-section">
              <h3>Analysis Result:</h3>
              <p>{result.prediction || result.class_name}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PneumoniaMLPage;

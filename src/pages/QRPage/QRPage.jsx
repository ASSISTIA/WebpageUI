import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./QRPage.module.css";
import { FaHome } from "react-icons/fa";

const QRPage = () => {
  const navigate = useNavigate();
  const { type } = useParams();
  const [qrUrl, setQrUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [displayType, setDisplayType] = useState('');
  const testDetails = {
    brain: [{ id: 1, name: "Brain MRI or CT Scan Image" }],
    kidney: [
      { id: 1, name: "Hemoglobin Level Test" },
      { id: 2, name: "Specific Gravity Test" },
      { id: 3, name: "Hypertension Status" },
    ],
    pneumonia: [{ id: 1, name: "Chest X-Ray Image" }],
    diabetes: [
      { id: 1, name: "Blood Test" },
      { id: 2, name: "Blood Pressure" },
    ],
  };

  const getDisplayName = useCallback((type) => {
    switch(type) {
      case 'brain':
        return 'Brain Tumor';
      case 'kidney':
        return 'Chronic Kidney Disease';
      case 'pneumonia':
        return 'Pneumonia';
      case 'diabetes':
        return 'Diabetes';
      default:
        return type ? type.charAt(0).toUpperCase() + type.slice(1) : '';
    }
  }, []);

  useEffect(() => {
    setDisplayType(getDisplayName(type));
  }, [type, getDisplayName]);

  const generateQRCode = useCallback(() => {
    try {
      setIsLoading(true);
      setError(null);

      const baseUrl = window.location.origin;
      // Adjust QR code size dynamically based on screen width
      const size = Math.min(window.innerWidth * 0.25, 250);
      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${baseUrl}/${type}&ecc=M`;

      setQrUrl(qrCodeUrl);
      setIsLoading(false);
    } catch (err) {
      setError("QR Generation Failed");
      setIsLoading(false);
    }
  }, [type]);

  useEffect(() => {
    generateQRCode();
    
    // Regenerate QR on window resize for optimal size
    const handleResize = () => {
      generateQRCode();
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [generateQRCode]);

  const handleBack = () => {
    navigate("/");
  };

  return (
    <div className={styles.touchContainer}>
      <div className={styles.pageTitle}>
        <button onClick={handleBack} className={styles.backButton}>
          <FaHome />
        </button>
        <h1 className={styles.titleText}>
          <span className={styles.bigLetter}>{displayType.charAt(0)}</span>
          <span className={styles.smallText}>{displayType.slice(1)}</span> 
          <span className={styles.analysisText}>ANALYSIS</span>
        </h1>
      </div>

      <div className={styles.contentWrapper}>
        <div className={styles.testList}>
          <h2>Required Values</h2>
          {testDetails[type]?.map((test) => (
            <div key={test.id} className={styles.testItem}>
              <span>{test.name}</span>
            </div>
          ))}
          {(!testDetails[type] || testDetails[type]?.length === 0) && (
            <div className={styles.noData}>No required values available</div>
          )}
        </div>

        <div className={styles.qrSection}>
          {isLoading ? (
            <div className={styles.loadingText}>Generating QR...</div>
          ) : error ? (
            <div className={styles.errorText}>{error}</div>
          ) : (
            <img src={qrUrl} alt="QR Code" className={styles.qrCode} />
          )}
          <div className={styles.footer}>
            <p>Scan QR</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRPage;
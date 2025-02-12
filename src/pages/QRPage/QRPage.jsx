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
      default:
        return type;
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
      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${baseUrl}/${type}&ecc=M`;

      setQrUrl(qrCodeUrl);
      setIsLoading(false);
    } catch (err) {
      setError("QR Generation Failed");
      setIsLoading(false);
    }
  }, [type]);

  useEffect(() => {
    generateQRCode();
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
        <h1><span className={styles.big}>{displayType.charAt(0).toUpperCase()}</span><span className={styles.small}>{displayType.slice(1).toUpperCase()}</span> <span className={styles.small}>ANALYSIS</span></h1>
      </div>

      <div className={styles.contentWrapper}>
        <div className={styles.testList}>
          <h2>Required Values</h2>
          {testDetails[type]?.map((test) => (
            <div key={test.id} className={styles.testItem}>
              <span>{test.name}</span>
            </div>
          ))}
        </div>

        <div className={styles.space}></div>

        <div className={styles.qrSection}>
          {isLoading ? (
            <div>Generating QR...</div>
          ) : error ? (
            <div>{error}</div>
          ) : (
            <img src={qrUrl} alt="QR Code" className={styles.qrCode} />
          )}
          <div className={styles.footer}>
            <p>Scan QR </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRPage;

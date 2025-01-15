import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import styles from './QRPage.module.css';

const QRPage = () => {
  const { type } = useParams();
  const [qrUrl, setQrUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const generateQRCode = useCallback(() => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Generate QR code based on the type
      const baseUrl = window.location.origin;
      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${baseUrl}/${type}&ecc=M`;
      
      setQrUrl(qrCodeUrl);
      setIsLoading(false);
    } catch (err) {
      setError('Failed to generate QR code');
      setIsLoading(false);
    }
  }, [type]);

  useEffect(() => {
    generateQRCode();
  }, [generateQRCode]);

  return (
    <div className={styles.container}>
      <h1>{type.charAt(0).toUpperCase() + type.slice(1)} Scan</h1>
      <div className={styles.qrContainer}>
        {isLoading ? (
          <div>Generating QR Code...</div>
        ) : error ? (
          <div>{error}</div>
        ) : (
          <img src={qrUrl} alt="QR Code" className={styles.qrCode} />
        )}
      </div>
    </div>
  );
};

export default QRPage;
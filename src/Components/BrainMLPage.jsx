import React, { useState } from 'react';
import { Button, TextField, Typography, Box, Paper, InputAdornment } from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import { ref, set } from "firebase/database";
import { database } from '../firebase'; 
import PatientInfoForm from './PatientInfoForm';

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
            });
            setPatientInfo(info); 
            console.log("Patient information saved successfully under 'BrainTumor'!");
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
                name: patientInfo.name,
                age: patientInfo.age,
                result: data.prediction || data.class_name
            });

        } catch (err) {
            setError(`Failed to analyze image: ${err.message}`);
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h5" component="h1" sx={{ mb: 2, fontWeight: 'bold' }}>
                Brain ML Model Analysis
            </Typography>
            {!patientInfo ? (
                <PatientInfoForm onInfoSubmit={handlePatientInfoSubmit} />
            ) : (
                <Box sx={{ gap: 2, flexDirection: 'column' }}>
                    <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
                        <Typography>Patient: {patientInfo.name}</Typography>
                        <Typography>Age: {patientInfo.age}</Typography>
                    </Paper>
                    <TextField
                        variant="outlined"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <ImageIcon />
                                </InputAdornment>
                            ),
                        }}
                        sx={{ mb: 2 }}
                    />
                    {image && (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSubmit}
                            disabled={loading}
                            fullWidth
                        >
                            {loading ? 'Analyzing...' : 'Analyze Image'}
                        </Button>
                    )}
                    {error && (
                        <Paper elevation={3} sx={{ p: 2, mt: 2, bgcolor: '#ffebee' }}>
                            <Typography color="error">⚠️ {error}</Typography>
                        </Paper>
                    )}
                    {result && (
                        <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                Analysis Result:
                            </Typography>
                            <Typography>
                                Classification: {result.prediction || result.class_name}
                            </Typography>
                            <Typography>
                                Confidence: {((result.confidence || result.probability || 0) * 100).toFixed(2)}%
                            </Typography>
                            <Typography variant="caption" sx={{ display: 'block', mt: 1, color: 'text.secondary' }}>
                                Raw response: {JSON.stringify(result)}
                            </Typography>
                        </Paper>
                    )}
                </Box>
            )}
        </Box>
    );
};

export default BrainMLPage;

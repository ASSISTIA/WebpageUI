import React, { useState } from "react";
import "./PatientFormStyles.css";

const PatientInfoForm = ({ onInfoSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    sex: "",
    email: "",
  });

  const [errors, setErrors] = useState({});

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.age || formData.age < 0 || formData.age > 120) {
      newErrors.age = "Please enter a valid age (0-120)";
    }

    if (!formData.sex) {
      newErrors.sex = "Please select a sex";
    }

    if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onInfoSubmit(formData);
    }
  };

  return (
    <div className="patient-form-container">
      <h2>Patient Information</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Patient Name</label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter patient name"
          />
          {errors.name && <div className="error-message">{errors.name}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="age">Age</label>
          <input
            id="age"
            name="age"
            type="number"
            value={formData.age}
            onChange={handleChange}
            placeholder="Enter age"
            min="0"
            max="120"
          />
          {errors.age && <div className="error-message">{errors.age}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="sex">Sex</label>
          <select
            id="sex"
            name="sex"
            value={formData.sex}
            onChange={handleChange}
          >
            <option value="">Select Gender</option>
            <option value="Female">Female</option>
            <option value="Male">Male</option>
            <option value="other">Other</option>
          </select>
          {errors.sex && <div className="error-message">{errors.sex}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email address"
          />
          {errors.email && <div className="error-message">{errors.email}</div>}
        </div>

        <button type="submit">Continue to Diagnosis</button>
      </form>
    </div>
  );
};

export default PatientInfoForm;

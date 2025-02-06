import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import styles from "./Home.module.css";

const Home = () => {
  const navigate = useNavigate();
  const [activeModule, setActiveModule] = useState(null);

  const menuOptions = [
    {
      id: 1,
      name: "Assistant",
      icon: require("../../assets/icons/Bot.png"),
      description: "AI Advisor"
    },
    {
      id: 2,
      name: "Gluco pro",
      icon: require("../../assets/icons/Glucometer.png"),
      description: "Diabetes Care"
    },
    {
      id: 3,
      name: "Kidney",
      icon: require("../../assets/icons/Kidneys.png"),
      description: "Renal Health"
    },
    {
      id: 4,
      name: "Brain",
      icon: require("../../assets/icons/Brain.png"),
      description: "Neuro Scan"
    },
    {
      id: 5,
      name: "Diabetes",
      icon: require("../../assets/icons/Heart.png"),
      description: "Cardiac Check"
    },
    {
      id: 6,
      name: "Pneumonia",
      icon: require("../../assets/icons/Lungs.png"),
      description: "Lung Screening"
    },
  ];

  const handleNavigation = (name) => {
    switch (name.toLowerCase()) {
      case 'diabetes':
      case 'brain':
      case 'kidney':
      case 'pneumonia':
        navigate(`/qr/${name.toLowerCase()}`);
        break;
      case 'assistant':
        navigate('/assistant');
        break;
      case 'gluco pro':
        navigate('/gluco-pro');
        break;
      default:
        console.warn(`Navigation not implemented for: ${name}`);
        break;
    }
  };

  return (
    <div className={styles.touchContainer}>
      <div className={styles.header}>
        <h1><span className={styles.big}>A</span><span className={styles.small}>SSISTIA</span></h1>
      </div>
      <div className={styles.touchGrid}>
        {menuOptions.map((option) => (
          <div
            key={option.id}
            className={`
              ${styles.touchModule} 
              ${activeModule === option.id ? styles.activeModule : ''}
            `}
            onTouchStart={() => setActiveModule(option.id)}
            onTouchEnd={() => setActiveModule(null)}
            onClick={() => handleNavigation(option.name)}
          >
            <img 
              src={option.icon} 
              alt={option.name} 
              className={styles.touchIcon}
            />
            <span className={styles.moduleName}>{option.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
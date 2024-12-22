import React from "react";
import styles from "./Home.module.css";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const menuOptions = [
    {
      id: 1,
      name: "Assistant",
      icon: require("../../assets/icons/Bot.png"),
    },
    {
      id: 2,
      name: "Gluco pro",
      icon: require("../../assets/icons/Glucometer.png"),
    },
    {
      id: 3,
      name: "Kidney",
      icon: require("../../assets/icons/Kidneys.png"),
    },
    {
      id: 4,
      name: "Brain",
      icon: require("../../assets/icons/Brain.png"),
    },
    {
      id: 5,
      name: "Heart",
      icon: require("../../assets/icons/Heart.png"),
    },
    {
      id: 6,
      name: "Pneumonia",
      icon: require("../../assets/icons/Lungs.png"),
    },
  ];

  const handleNavigation = () => {
    navigate("/brain");
  };

  const renderOption = () => (
    <div className={styles.menu}>
      {menuOptions.map((option) => (
        <div
          className={styles.menuOption}
          key={option.id}
          onClick={handleNavigation}
        >
          <img className={styles.icon} src={option.icon} />
          <span className={styles.menuTitle}>{option.name}</span>
        </div>
      ))}
    </div>
  );

  return <div className={styles.container}>{renderOption()}</div>;
};

export default Home;

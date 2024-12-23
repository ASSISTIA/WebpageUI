import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BrainMLPage from "./Components/BrainMLPage";
import PneumoniaMLPage from "./Components/PneumoniaMLPage";
import CKDMLPage from "./Components/CKDMLPage";
import "./App.css";
import Home from "./pages/Home/Home";
import QRPage from './pages/QRPage/QRPage';
import Assistant from './pages/Assistant/Assistant';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/brain" element={<BrainMLPage />} />
        <Route path="/pneumonia" element={<PneumoniaMLPage />} />
        <Route path="/ckd" element={<CKDMLPage />} />
        <Route path="/qr/:type" element={<QRPage />} />
        <Route path="/assistant" element={<Assistant />} />
      </Routes>
    </Router>
  );
};

export default App;

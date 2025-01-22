import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import BrainMLPage from "./Components/BrainMLPage";
import PneumoniaMLPage from "./Components/PneumoniaMLPage";
import CKDMLPage from "./Components/CKDMLPage";
import "./App.css";
import Home from "./pages/Home/Home";
import QRPage from "./pages/QRPage/QRPage";
import Assistant from "./pages/Assistant/Assistant";
import HeartBeat from "./pages/HeartBeat/HeartBeat";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/brain" element={<BrainMLPage />} />
        <Route path="/pneumonia" element={<PneumoniaMLPage />} />
        <Route path="/ckd" element={<CKDMLPage />} />
        <Route path="/heart" element={<Navigate to="/qr/heart" replace />} />
        <Route path="/qr/:type" element={<QRPage />} />
        <Route path="/assistant" element={<Assistant />} />
        <Route
          path="/gluco-pro"
          element={<Navigate to="/qr/gluco-pro" replace />}
        />
        <Route path="/heart-beat" element={<HeartBeat />} />
      </Routes>
    </Router>
  );
};

export default App;

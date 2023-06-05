import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./components/Screens/LoginPage";
import EnrollmentManagementSystem from "./components/Screens/EnrollmentManagementSystem";
import SubjectsPage from "./components/Screens/SubjectsPage";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const isUserLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(isUserLoggedIn);
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
    sessionStorage.setItem("isLoggedIn", "true");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    sessionStorage.setItem("isLoggedIn", "false");
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage onLogin={handleLogin} />} />
        <Route
          path="/enroll"
          element={
            isLoggedIn ? (
              <EnrollmentManagementSystem logoutClick={handleLogout} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/subjects"
          element={
            isLoggedIn ? (
              <SubjectsPage logoutClick={handleLogout} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </Router>
  );
};

export default App;

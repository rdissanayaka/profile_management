"use client";

import React from "react";
import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { initDB, getUser, saveUser } from "./utils/indexedDB";
import Login from "./components/Login";
import Register from "./components/Register";
import Homepage from "./components/Homepage";
import MyProfile from "./components/MyProfile";
import EditProfile from "./components/EditProfile";
import Cookies from "js-cookie";
import "./App.css";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      await initDB();

      // Check localStorage first (for backward compatibility)
      let savedUser = localStorage.getItem("currentUser");

      // If not in localStorage, fallback to cookie
      if (!savedUser) {
        savedUser = Cookies.get("currentUser");
      }

      if (savedUser) {
        const userData = await getUser(savedUser);
        if (userData) {
          setCurrentUser(userData);
        }
      }

      setIsLoading(false);
    };

    initializeApp();
  }, []);

  const handleLogin = async (userId, password, keepLoggedIn) => {
    const user = await getUser(userId);
    if (user && user.password === password) {
      setCurrentUser(user);

      if (keepLoggedIn) {
        // Save to cookie for 1 year
        Cookies.set("currentUser", userId, { expires: 365 });
      } else {
        // Save to cookie (session only)
        Cookies.set("currentUser", userId);
      }

      return true;
    }

    return false;
  };

  const handleRegister = async (userId, password) => {
    const existingUser = await getUser(userId);
    if (existingUser) {
      return false; // User already exists
    }

    const newUser = {
      userId,
      password,
      basicDetails: {},
      additionalDetails: {},
      spouseDetails: {},
      personalDetails: {},
    };

    await saveUser(newUser);
    return true;
  };

  const handleLogout = () => {
    Cookies.remove("currentUser");
    localStorage.removeItem("currentUser"); // Clean both
    setCurrentUser(null);
  };

  const updateUserProfile = async (updatedUser) => {
    await saveUser(updatedUser);
    setCurrentUser(updatedUser);
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-text">Loading...</div>
      </div>
    );
  }

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route
            path="/login"
            element={
              currentUser ? (
                <Navigate to="/homepage" replace />
              ) : (
                <Login onLogin={handleLogin} />
              )
            }
          />
          <Route
            path="/register"
            element={
              currentUser ? (
                <Navigate to="/homepage" replace />
              ) : (
                <Register onRegister={handleRegister} />
              )
            }
          />
          <Route
            path="/homepage"
            element={
              currentUser ? (
                <Homepage user={currentUser} onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/myprofile"
            element={
              currentUser ? (
                <MyProfile user={currentUser} onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/editprofile"
            element={
              currentUser ? (
                <EditProfile
                  user={currentUser}
                  onLogout={handleLogout}
                  onUpdateProfile={updateUserProfile}
                />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/"
            element={
              <Navigate to={currentUser ? "/homepage" : "/login"} replace />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

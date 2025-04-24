import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import CompletedBooks from './components/CompletedBooks';
import Login from './components/Login';
import Register from './components/Register';
import { useAuth } from './context/AuthContext'; // Import AuthContext
import 'animate.css';
import 'materialize-css/dist/css/materialize.min.css';
import 'materialize-css/dist/js/materialize.min.js';

function App() {
  const { isAuthenticated, checkAuth } = useAuth(); // Use AuthContext

  useEffect(() => {
    checkAuth(); // Check authentication status on app load
  }, [checkAuth]);

  return (
    <div className="container">
      <div className="title-container" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <img
          src="/logo.png" // Assurez-vous que le fichier logo.png existe dans le dossier public
          alt="Logo"
          style={{ width: '50px', height: '50px' }}
        />
        <h1 className="title has-text-centered has-text-danger app-title">
          Suivi de Lecture Gamifiée
        </h1>
      </div>
      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />}
        /> {/* Redirect to dashboard if authenticated */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/progress"
          element={isAuthenticated ? <CompletedBooks /> : <Navigate to="/login" />}
        />
      </Routes>
    </div>
  );
}

export default App;

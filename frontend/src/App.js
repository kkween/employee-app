import React, { useState } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import EmployeeList from './components/EmployeeList';
import AddEmployee from './components/AddEmployee';
import EditEmployee from './components/EditEmployee';
import AdminLogin from './components/AdminLogin';

function App() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    navigate('/admin/login');
  };

  return (
    <div>
      <header
        style={{
          background: 'linear-gradient(90deg, #007bff 60%, #0056b3 100%)',
          color: 'white',
          padding: '0.75rem 0',
          marginBottom: '1.2rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          maxWidth: 1400,
          margin: '0 auto',
          padding: '0 1.5rem'
        }}>
          <h1 style={{
            margin: 0,
            fontWeight: 700,
            letterSpacing: '2px',
            fontSize: '1.3rem'
          }}>
            Employee App
          </h1>
          {isAdminLoggedIn && (
            <button
              onClick={handleLogout}
              style={{
                background: 'linear-gradient(90deg, #ff9800 60%, #ffb74d 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                padding: '0.5rem 1.2rem',
                fontWeight: 600,
                fontSize: '1rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                cursor: 'pointer',
                transition: 'background 0.2s, color 0.2s'
              }}
              onMouseOver={e => {
                e.target.style.background = 'linear-gradient(90deg, #fb8c00 60%, #ffe0b2 100%)';
                e.target.style.color = '#007bff';
              }}
              onMouseOut={e => {
                e.target.style.background = 'linear-gradient(90deg, #ff9800 60%, #ffb74d 100%)';
                e.target.style.color = '#fff';
              }}
            >
              Logout
            </button>
          )}
        </div>
      </header>
      <Routes>
        <Route
          path="/"
          element={
            isAdminLoggedIn
              ? <EmployeeList isAdminLoggedIn={isAdminLoggedIn} onLogout={handleLogout} />
              : <Navigate to="/admin/login" replace />
          }
        />
        <Route path="/add" element={isAdminLoggedIn ? <AddEmployee /> : <Navigate to="/admin/login" replace />} />
        <Route path="/edit/:id" element={isAdminLoggedIn ? <EditEmployee /> : <Navigate to="/admin/login" replace />} />
        <Route
          path="/admin/login"
          element={<AdminLogin onLogin={() => setIsAdminLoggedIn(true)} />}
        />
      </Routes>
    </div>
  );
}

export default App;

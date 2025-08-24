import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Use environment variable or default to localhost
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

const AdminLogin = ({ onLogin }) => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/admin/login`,
        form,
        { withCredentials: true }
      );
      if (res.data.success) {
        onLogin();
        navigate('/'); // Redirect to employee list after login
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
      <form
        onSubmit={handleSubmit}
        style={{
          minWidth: 320,
          padding: 32,
          borderRadius: 8,
          background: '#fff',
          boxShadow: '0 4px 24px rgba(0,0,0,0.18), 0 1.5px 8px rgba(0,0,0,0.12)'
        }}
      >
        <h3 className="mb-4 text-center" style={{ color: '#007bff' }}>Admin Login</h3>
        {error && <div className="alert alert-danger py-1">{error}</div>}
        <div className="mb-3">
          <label className="form-label">Username</label>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            className="form-control"
            placeholder="Enter admin username"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <div className="input-group">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              tabIndex={-1}
              style={{
                minWidth: 70,
                border: 'none',
                background: showPassword ? '#2196f3' : '#ff9800',
                color: '#fff',
                fontWeight: 500,
                borderRadius: '0 6px 6px 0',
                transition: 'background 0.2s, color 0.2s',
                cursor: 'pointer'
              }}
              onMouseOver={e => {
                e.target.style.background = showPassword ? '#1976d2' : '#fb8c00';
                e.target.style.color = '#fff';
              }}
              onMouseOut={e => {
                e.target.style.background = showPassword ? '#2196f3' : '#ff9800';
                e.target.style.color = '#fff';
              }}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>
        <button type="submit" className="btn btn-primary w-100">Login</button>
      </form>
    </div>
  );
};

export default AdminLogin;
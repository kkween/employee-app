import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Use environment variable or default to localhost
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

const AddEmployee = () => {
  const [form, setForm] = useState({ name: '', email: '', position: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(`${API_BASE_URL}/api/employees`, form, { withCredentials: true })
      .then(() => navigate('/'))
      .catch((err) => {
        console.error('Error adding employee:', err);
        alert('Failed to add employee');
      });
  };

  return (
    <div className="container mt-5">
      <h2>Add Employee</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          value={form.name}
          placeholder="Name"
          className="form-control mb-2"
          onChange={handleChange}
        />
        <input
          name="email"
          value={form.email}
          placeholder="Email"
          className="form-control mb-2"
          onChange={handleChange}
        />
        <input
          name="position"
          value={form.position}
          placeholder="Position"
          className="form-control mb-2"
          onChange={handleChange}
        />
        <button className="btn btn-success" type="submit">Add</button>
      </form>
    </div>
  );
};

export default AddEmployee;

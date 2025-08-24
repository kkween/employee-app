import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

// Use environment variable or default to localhost
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

const EditEmployee = () => {
  const [form, setForm] = useState({ name: '', email: '', position: '' });
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE_URL}/api/employees/${id}`);
        setForm({
          name: res.data?.name || '',
          email: res.data?.email || '',
          position: res.data?.position || ''
        });
      } catch (err) {
        console.error('Error fetching employee:', err, err.response);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployee();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email) {
      alert('Name and email are required');
      return;
    }
    try {
      await axios.put(`${API_BASE_URL}/api/employees/${id}`, form, { withCredentials: true });
      alert('Employee updated successfully!');
      navigate('/');
    } catch (err) {
      console.error('Error updating employee:', err);
      alert(
        err.response?.data?.error || 'Failed to update employee. Please try again.'
      );
    }
  };

  if (loading) {
    return <div className="container mt-5">Loading...</div>;
  }

  return (
    <div className="container mt-5">
      <h2>Edit Employee</h2>
      <div style={{ maxWidth: 400, margin: '0 auto' }}>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter name"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter email"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="position" className="form-label">
              Position
            </label>
            <input
              type="text"
              name="position"
              value={form.position}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter position (optional)"
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Update
          </button>
          <button
            type="button"
            className="btn btn-secondary ms-2"
            onClick={() => navigate('/')}
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditEmployee;


import { Link, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';


const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';


const EmployeeList = ({ isAdminLoggedIn, onLogout }) => {
  const [employees, setEmployees] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', position: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdminLoggedIn) {
      navigate('/admin/login');
      return;
    }
    axios.get(`${API_BASE_URL}/api/employees`, { withCredentials: true })
      .then(res => setEmployees(res.data))
      .catch(err => {
        setError('Failed to fetch employees.');
      });
  }, [isAdminLoggedIn, navigate]);

  const deleteEmployee = (id) => {
    axios.delete(`${API_BASE_URL}/api/employees/${id}`, { withCredentials: true })
      .then(() => setEmployees(employees.filter(emp => emp.id !== id)));
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email) {
      alert('Name and email are required');
      return;
    }
    const res = await axios.post(`${API_BASE_URL}/api/employees`, form, { withCredentials: true });
    setEmployees([...employees, res.data]);
    setForm({ name: '', email: '', position: '' });
    setShowForm(false);
  };

  const handleShowForm = () => {
    setForm({ name: '', email: '', position: '' });
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setForm({ name: '', email: '', position: '' });
  };

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="container d-flex flex-column min-vh-100" style={{ paddingTop: '60px' }}>
      <div className="row justify-content-center">
        <div className="col-lg-7 col-md-8">
          <div className="mb-4 d-flex align-items-center justify-content-between">
            <h2
              style={{
                margin: 0,
                fontWeight: 600,
                letterSpacing: '1px',
                color: '#007bff',
                fontSize: '1.1rem',
              }}
            >
              Employee List
            </h2>
            <button className="btn btn-primary btn-sm" onClick={handleShowForm}>
              + Add Employee
            </button>
          </div>
          <div style={{ maxWidth: '100%', margin: '0 auto' }}>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Position</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp, idx) => (
                  <tr key={emp.id}>
                    <td>{idx + 1}</td>
                    <td>{emp.name}</td>
                    <td>{emp.email}</td>
                    <td>{emp.position}</td>
                    <td className="text-center">
                      <Link to={`/edit/${emp.id}`} className="btn btn-warning btn-sm me-1">Edit</Link>
                      <button className="btn btn-danger btn-sm" style={{ marginLeft: '4px' }} onClick={() => deleteEmployee(emp.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Form */}
      {showForm && (
        <div
          style={{
            position: 'fixed',
            top: 0, left: 0, width: '100vw', height: '100vh',
            background: 'rgba(0,0,0,0.4)',
            zIndex: 200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div
            style={{
              background: '#fff',
              padding: '2rem 2.5rem',
              borderRadius: '10px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
              minWidth: 350,
              maxWidth: 400,
              width: '100%',
              position: 'relative'
            }}
          >
            <button
              onClick={handleCloseForm}
              style={{
                position: 'absolute',
                top: 10,
                right: 15,
                border: 'none',
                background: 'transparent',
                fontSize: '1.5rem',
                color: '#888',
                cursor: 'pointer'
              }}
              aria-label="Close"
            >
              &times;
            </button>
            <h4 className="mb-4" style={{ color: '#007bff', fontWeight: 600 }}>Add Employee</h4>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Name</label>
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
                <label className="form-label">Email</label>
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
                <label className="form-label">Position</label>
                <input
                  type="text"
                  name="position"
                  value={form.position}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter position (optional)"
                />
              </div>
              <button type="submit" className="btn btn-primary w-100">
                Add
              </button>
            </form>
          </div>
        </div>
      )}

      <footer
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          width: '100%',
          padding: '1rem 0',
          textAlign: 'center',
          color: '#888',
          borderTop: '1px solid #eee',
          fontSize: '0.95rem',
          background: '#fff',
          zIndex: 100
        }}
      >
        &copy; {new Date().getFullYear()} Employee App. All rights reserved.
      </footer>
    </div>
  );
};

export default EmployeeList;

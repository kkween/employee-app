const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = 5000; // Consistent port usage

let adminSession = null;

// Middleware
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// Admin authentication middleware
function requireAdmin(req, res, next) {
  if (!adminSession) {
    return res.status(401).json({ error: 'Unauthorized: Admin login required' });
  }
  next();
}

// GET: Fetch all employees
app.get('/api/employees', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM employees');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching employees:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST: Add a new employee
app.post('/api/employees', async (req, res) => {
  const { name, email, position = 'Employee' } = req.body;

  // Basic validation0
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO employees (name, email, position) VALUES (?, ?, ?)',
      [name, email, position]
    );
    res.status(201).json({ id: result.insertId, name, email, position });
  } catch (err) {
    console.error('Error adding employee:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT: Update an employee by ID
app.put('/api/employees/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, position = 'Employee' } = req.body;

  // Basic validation
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  try {
    const [result] = await db.query(
      'UPDATE employees SET name = ?, email = ?, position = ? WHERE id = ?',
      [name, email, position, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.json({ id: parseInt(id), name, email, position });
  } catch (err) {
    console.error('Error updating employee:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE: Delete an employee by ID
app.delete('/api/employees/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query('DELETE FROM employees WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.json({ message: 'Employee deleted successfully' });
  } catch (err) {
    console.error('Error deleting employee:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST: Admin login endpoint
app.post('/api/admin/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const [rows] = await db.query('SELECT * FROM admins WHERE username = ?', [username]);
    if (rows.length === 0 || rows[0].password !== password) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
    // Set session (in-memory, for demo only)
    adminSession = { username };
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// POST: Admin logout endpoint
app.post('/api/admin/logout', (req, res) => {
  adminSession = null;
  res.json({ success: true });
});

// Protect employee routes
app.use('/api/employees', requireAdmin);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
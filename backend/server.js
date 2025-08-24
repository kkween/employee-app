const express = require('express');
const cors = require('cors');
const db = require('./db');
const crypto = require('crypto');
const session = require('express-session');

const app = express();
const PORT = 5000;

app.use(cors({
  origin: ['http://localhost:3000', 'http://147.182.236.228:3000'],
  credentials: true
}));
app.use(express.json());
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

function requireAdmin(req, res, next) {
  if (!req.session || !req.session.admin) {
    return res.status(401).json({ error: 'Unauthorized: Admin login required' });
  }
  next();
}

// Protect employee routes
app.use('/api/employees', requireAdmin);

// Admin login/logout routes
app.post('/api/admin/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
    const [rows] = await db.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, hashedPassword]);
    if (rows.length === 0) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
    req.session.admin = { username };
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

app.post('/api/admin/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

// Employee routes (these are now protected)
app.get('/api/employees', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM employees');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching employees:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/employees', async (req, res) => {
  const { name, email, position = 'Employee' } = req.body;
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

app.put('/api/employees/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, position = 'Employee' } = req.body;
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

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
});
const db = require('./db');

async function seedAdmins() {
  const admins = [
    { username: 'kween', password: 'test123' },
    { username: 'admin2', password: 'mypassword' }
  ];

  for (const admin of admins) {
    await db.query(
      'INSERT INTO admins (username, password) VALUES (?, ?) ON DUPLICATE KEY UPDATE password = VALUES(password)',
      [admin.username, admin.password]
    );
    console.log(`Seeded admin: ${admin.username}`);
  }
  process.exit();
}

seedAdmins();
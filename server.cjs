const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 5174; // Match existing port
const dbPath = path.join(__dirname, 'database', 'tasks.db');
const db = new sqlite3.Database(dbPath);

// Middleware
app.use(morgan('dev'));
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});
app.use(express.json());
app.use(cors());
app.use(helmet({
  contentSecurityPolicy: false, // For local dev
}));

// Database Utilities
const runQuery = (sql, params = []) => new Promise((resolve, reject) => {
  db.run(sql, params, function(err) {
    if (err) reject(err);
    else resolve(this);
  });
});

const allQuery = (sql, params = []) => new Promise((resolve, reject) => {
  db.all(sql, params, (err, rows) => {
    if (err) reject(err);
    else resolve(rows);
  });
});

const getQuery = (sql, params = []) => new Promise((resolve, reject) => {
  db.get(sql, params, (err, row) => {
    if (err) reject(err);
    else resolve(row);
  });
});

// Initialize Database
async function initDb() {
  await runQuery(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      priority TEXT CHECK(priority IN ('Urgent', 'High', 'Medium', 'Low')),
      status TEXT CHECK(status IN ('To Do', 'In Progress', 'Review', 'Completed')),
      dueDate TEXT,
      assignee TEXT,
      tags TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await runQuery(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      progress INTEGER DEFAULT 0,
      status TEXT,
      dueDate TEXT,
      members TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Seed Data if empty
  const taskCount = await getQuery('SELECT COUNT(*) as count FROM tasks');
  if (taskCount.count === 0) {
    const tasks = [
      ['Design new landing page', 'Create mockups for homepage redesign', 'High', 'In Progress', '2026-04-25', 'Sarah Chen', 'Design,UI/UX'],
      ['Fix authentication bug', 'Resolve login timeout issue', 'Urgent', 'To Do', '2026-04-22', 'Mike Johnson', 'Bug,Backend'],
      ['Update API documentation', 'Add new endpoints to docs', 'Medium', 'Review', '2026-04-28', 'John Doe', 'Documentation'],
      ['Implement dark mode', 'Add theme switching capability', 'Low', 'To Do', '2026-05-01', 'Emma Davis', 'Feature,Frontend'],
    ];
    for (const t of tasks) {
      await runQuery(`INSERT INTO tasks (name, description, priority, status, dueDate, assignee, tags) VALUES (?, ?, ?, ?, ?, ?, ?)`, t);
    }
  }

  const projectCount = await getQuery('SELECT COUNT(*) as count FROM projects');
  if (projectCount.count === 0) {
    const projects = [
      ['Website Redesign', 'Complete overhaul of company website', 67, 'On Track', 'May 15', 'SC,MJ,ED'],
      ['Mobile App Launch', 'iOS and Android app development', 45, 'On Track', 'Jun 30', 'JC,CI,SC'],
      ['Marketing Campaign Q2', 'Digital marketing initiatives', 89, 'At Risk', 'Apr 30', 'ED,MJ'],
    ];
    for (const p of projects) {
      await runQuery(`INSERT INTO projects (name, description, progress, status, dueDate, members) VALUES (?, ?, ?, ?, ?, ?)`, p);
    }
  }
}

// API Routes
app.get('/api/stats', async (req, res) => {
  try {
    const total = await getQuery('SELECT COUNT(*) as count FROM tasks');
    const completed = await getQuery("SELECT COUNT(*) as count FROM tasks WHERE status = 'Completed'");
    const inProgress = await getQuery("SELECT COUNT(*) as count FROM tasks WHERE status = 'In Progress'");
    const overdue = await getQuery("SELECT COUNT(*) as count FROM tasks WHERE dueDate < date('now') AND status != 'Completed'");

    res.json([
      { label: 'Total Tasks', value: total.count.toString(), color: 'bg-blue-500' },
      { label: 'Completed', value: completed.count.toString(), color: 'bg-green-500' },
      { label: 'In Progress', value: inProgress.count.toString(), color: 'bg-orange-500' },
      { label: 'Overdue', value: overdue.count.toString(), color: 'bg-red-500' },
    ]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await allQuery('SELECT * FROM tasks ORDER BY created_at DESC');
    // Parse tags back to array
    const formattedTasks = tasks.map(t => ({
      ...t,
      tags: t.tags ? t.tags.split(',') : []
    }));
    res.json(formattedTasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/tasks', async (req, res) => {
  const { name, description, priority, status, dueDate, assignee, tags } = req.body;
  try {
    const result = await runQuery(
      `INSERT INTO tasks (name, description, priority, status, dueDate, assignee, tags) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, description, priority, status, dueDate, assignee, Array.isArray(tags) ? tags.join(',') : tags]
    );
    res.status(201).json({ id: result.lastID });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const fields = Object.keys(updates).map(k => `${k} = ?`).join(', ');
  const values = Object.values(updates);
  try {
    await runQuery(`UPDATE tasks SET ${fields} WHERE id = ?`, [...values, id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await runQuery('DELETE FROM tasks WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/projects', async (req, res) => {
  try {
    const projects = await allQuery('SELECT * FROM projects');
    const formattedProjects = projects.map(p => ({
      ...p,
      members: p.members ? p.members.split(',') : []
    }));
    res.json(formattedProjects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/projects', async (req, res) => {
  const { name, description, progress, status, dueDate, members } = req.body;
  try {
    const result = await runQuery(
      `INSERT INTO projects (name, description, progress, status, dueDate, members) VALUES (?, ?, ?, ?, ?, ?)`,
      [name, description, progress || 0, status || 'On Track', dueDate, Array.isArray(members) ? members.join(',') : members]
    );
    res.status(201).json({ id: result.lastID });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/projects/:id', async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const fields = Object.keys(updates).map(k => `${k} = ?`).join(', ');
  const values = Object.values(updates);
  try {
    await runQuery(`UPDATE projects SET ${fields} WHERE id = ?`, [...values, id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/projects/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await runQuery('DELETE FROM projects WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/analytics', async (req, res) => {
  try {
    // Simple analytics data
    const weeklyData = [
      { day: 'Mon', completed: 12 },
      { day: 'Tue', completed: 15 },
      { day: 'Wed', completed: 18 },
      { day: 'Thu', completed: 14 },
      { day: 'Fri', completed: 20 },
      { day: 'Sat', completed: 8 },
      { day: 'Sun', completed: 6 },
    ];
    const categoryData = [
      { name: 'Development', value: 45, color: '#6366f1' },
      { name: 'Design', value: 25, color: '#8b5cf6' },
      { name: 'Marketing', value: 20, color: '#ec4899' },
      { name: 'Other', value: 10, color: '#64748b' },
    ];
    res.json({ weeklyData, categoryData });
  } catch (err) {
    console.error(`[ERROR] GET /api/analytics: ${err.message}`, err.stack);
    res.status(500).json({ error: err.message });
  }
});

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

// Start Server
initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('Failed to initialize database:', err);
});

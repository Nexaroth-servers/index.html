// Simple Express backend for Nexaroth shop (demo)
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'nexaroth.db');
const db = new Database(DB_PATH);

const JWT_SECRET = process.env.JWT_SECRET || 'change_me_jwt_secret';
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || 'change_me_webhook_secret';

// Initialize schema if needed
function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE
    );

    CREATE TABLE IF NOT EXISTS balances (
      user_id TEXT PRIMARY KEY,
      vote INTEGER DEFAULT 0,
      donation INTEGER DEFAULT 0,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS items (
      id TEXT PRIMARY KEY,
      name TEXT,
      description TEXT,
      price_vote INTEGER DEFAULT 0,
      price_donate INTEGER DEFAULT 0
    );
  `);

  // Insert demo user if not exists
  const userRow = db.prepare('SELECT id FROM users WHERE username = ?').get('demo');
  if (!userRow) {
    const id = 'user-demo';
    db.prepare('INSERT INTO users (id, username) VALUES (?, ?)').run(id, 'demo');
    db.prepare('INSERT INTO balances (user_id, vote, donation) VALUES (?, ?, ?)').run(id, 100, 200);
  }

  // Insert sample items
  const items = db.prepare('SELECT COUNT(1) AS c FROM items').get();
  if (items.c === 0) {
    const insert = db.prepare('INSERT INTO items (id,name,description,price_vote,price_donate) VALUES (?,?,?,?,?)');
    insert.run('mount-epic','Monture Épique','Monture exclusive du serveur',50,0);
    insert.run('donor-pack','Pack Donateur','Bonus et cosmétiques',0,500);
  }
}

initDb();

// Auth: simple login by username → returns JWT with user_id
app.post('/api/login', (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ error: 'username required' });

  let user = db.prepare('SELECT id, username FROM users WHERE username = ?').get(username);
  if (!user) {
    // create user
    const id = 'user-' + Date.now();
    db.prepare('INSERT INTO users (id, username) VALUES (?, ?)').run(id, username);
    db.prepare('INSERT INTO balances (user_id, vote, donation) VALUES (?, ?, ?)').run(id, 0, 0);
    user = { id, username };
  }

  const token = jwt.sign({ user_id: user.id }, JWT_SECRET, { expiresIn: '30d' });
  res.json({ token, user_id: user.id });
});

// Middleware
function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: 'missing authorization header' });
  const parts = header.split(' ');
  if (parts.length !== 2) return res.status(401).json({ error: 'invalid authorization header' });
  const token = parts[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user_id = payload.user_id;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'invalid token' });
  }
}

// GET balance
app.get('/api/balance', authMiddleware, (req, res) => {
  const balance = db.prepare('SELECT vote, donation FROM balances WHERE user_id = ?').get(req.user_id);
  if (!balance) return res.status(404).json({ error: 'balance not found' });
  res.json(balance);
});

// GET items catalog
app.get('/api/items', (req, res) => {
  const rows = db.prepare('SELECT id,name,description,price_vote,price_donate FROM items').all();
  res.json(rows);
});

// POST purchase
app.post('/api/purchase', authMiddleware, (req, res) => {
  const { item_id, method } = req.body;
  if (!item_id || !method) return res.status(400).json({ error: 'item_id and method required' });

  const item = db.prepare('SELECT * FROM items WHERE id = ?').get(item_id);
  if (!item) return res.status(404).json({ error: 'item not found' });

  const bal = db.prepare('SELECT vote, donation FROM balances WHERE user_id = ?').get(req.user_id);
  if (!bal) return res.status(404).json({ error: 'balance not found' });

  if (method === 'vote') {
    if (bal.vote < item.price_vote) return res.status(400).json({ error: 'insufficient vote points' });
    db.prepare('UPDATE balances SET vote = vote - ? WHERE user_id = ?').run(item.price_vote, req.user_id);
  } else if (method === 'donation') {
    if (bal.donation < item.price_donate) return res.status(400).json({ error: 'insufficient donation points' });
    db.prepare('UPDATE balances SET donation = donation - ? WHERE user_id = ?').run(item.price_donate, req.user_id);
  } else {
    return res.status(400).json({ error: 'invalid method' });
  }

  // Record keeping could be added (purchases table). For demo, we just deduct and return success.
  res.json({ success: true, message: 'purchase successful' });
});

// Webhooks to credit points (vote and donation) — protected by a simple shared secret
app.post('/webhook/vote', (req, res) => {
  const token = req.headers['x-webhook-token'];
  if (token !== WEBHOOK_SECRET) return res.status(401).json({ error: 'invalid webhook token' });
  const { user_id, amount } = req.body;
  if (!user_id || !amount) return res.status(400).json({ error: 'user_id and amount required' });

  const bal = db.prepare('SELECT user_id FROM balances WHERE user_id = ?').get(user_id);
  if (!bal) return res.status(404).json({ error: 'user not found' });

  db.prepare('UPDATE balances SET vote = vote + ? WHERE user_id = ?').run(amount, user_id);
  res.json({ success: true });
});

app.post('/webhook/donate', (req, res) => {
  const token = req.headers['x-webhook-token'];
  if (token !== WEBHOOK_SECRET) return res.status(401).json({ error: 'invalid webhook token' });
  const { user_id, amount } = req.body;
  if (!user_id || !amount) return res.status(400).json({ error: 'user_id and amount required' });

  const bal = db.prepare('SELECT user_id FROM balances WHERE user_id = ?').get(user_id);
  if (!bal) return res.status(404).json({ error: 'user not found' });

  db.prepare('UPDATE balances SET donation = donation + ? WHERE user_id = ?').run(amount, user_id);
  res.json({ success: true });
});

// Health
app.get('/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Nexaroth shop backend running on port ${PORT}`);
});

const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3001;
const DB_PATH = path.resolve(__dirname, 'data', 'db.json');
const SECRET = process.env.JWT_SECRET || 'dev-secret';

function readDB() {
  if (!fs.existsSync(DB_PATH)) {
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
    fs.writeFileSync(DB_PATH, JSON.stringify({ users: {}, stats: [] }, null, 2));
  }
  const raw = fs.readFileSync(DB_PATH, 'utf8');
  return JSON.parse(raw);
}

function writeDB(db) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

function authMiddleware(req, res, next) {
  const auth = req.headers['authorization'];
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Missing token' });
  const token = auth.substring(7);
  try {
    const payload = jwt.verify(token, SECRET);
    req.user = payload;
    next();
  } catch (e) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

app.use(bodyParser.json());
app.use((req, res, next) => { res.setHeader('Access-Control-Allow-Origin', '*'); res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS'); res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); if (req.method === 'OPTIONS') { return res.sendStatus(204); } next(); });

app.post('/auth/register', async (req, res) => {
  const { email, password, displayName } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing email or password' });
  const db = readDB();
  // ensure unique email
  for (const uid in db.users) {
    if (db.users[uid].email === email) {
      return res.status(400).json({ error: 'Email exists' });
    }
  }
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  const uid = 'u_' + Date.now();
  db.users[uid] = {
    uid,
    email,
    passwordHash: hash,
    displayName: displayName || email.split('@')[0],
    photoURL: '',
    lastLogin: new Date().toISOString(),
    countdowns: {}
  };
  writeDB(db);
  const token = jwt.sign({ uid }, SECRET, { expiresIn: '7d' });
  res.json({ token, user: { uid, email, displayName: db.users[uid].displayName } });
});

app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const db = readDB();
  let foundUid = null;
  for (const uid in db.users) {
    if (db.users[uid].email === email) { foundUid = uid; break; }
  }
  if (!foundUid) return res.status(400).json({ error: 'User not found' });
  const user = db.users[foundUid];
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: 'Invalid password' });
  user.lastLogin = new Date().toISOString();
  writeDB(db);
  const token = jwt.sign({ uid: foundUid }, SECRET, { expiresIn: '7d' });
  res.json({ token, user: { uid: foundUid, email, displayName: user.displayName } });
});

app.get('/countdowns', authMiddleware, (req, res) => {
  const db = readDB();
  const uid = req.user.uid;
  const u = db.users[uid];
  if (!u) return res.status(404).json({ error: 'User not found' });
  const items = Object.values(u.countdowns || {});
  res.json({ countdowns: items });
});

app.post('/countdowns', authMiddleware, (req, res) => {
  const { id, title, targetDateISO, timezone, format, settings } = req.body;
  if (!targetDateISO) return res.status(400).json({ error: 'targetDateISO required' });
  const db = readDB();
  const uid = req.user.uid;
  const u = db.users[uid];
  if (!u) return res.status(404).json({ error: 'User not found' });
  const countdown = {
    id: id ?? ('cd_' + Date.now()),
    title: title ?? 'Untitled',
    targetDateISO,
    timezone,
    format,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    settings: settings ?? {}
  };
  if (!u.countdowns) u.countdowns = {};
  u.countdowns[countdown.id] = countdown;
  writeDB(db);
  res.json({ countdown });
});

app.put('/countdowns/:id', authMiddleware, (req, res) => {
  const id = req.params.id;
  const db = readDB();
  const uid = req.user.uid;
  const u = db.users[uid];
  if (!u || !u.countdowns || !u.countdowns[id]) return res.status(404).json({ error: 'Countdown not found' });
  Object.assign(u.countdowns[id], req.body);
  u.countdowns[id].updatedAt = new Date().toISOString();
  writeDB(db);
  res.json({ countdown: u.countdowns[id] });
});

app.delete('/countdowns/:id', authMiddleware, (req, res) => {
  const id = req.params.id;
  const db = readDB();
  const uid = req.user.uid;
  const u = db.users[uid];
  if (!u || !u.countdowns || !u.countdowns[id]) return res.status(404).json({ error: 'Countdown not found' });
  delete u.countdowns[id];
  writeDB(db);
  res.json({ ok: true });
});

app.get('/health', (req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});

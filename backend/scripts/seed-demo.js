const fs = require('fs');
const path = require('path');

const DB_PATH = path.resolve(__dirname, 'data', 'db.json');
function readDB() {
  if (!fs.existsSync(DB_PATH)) {
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
    fs.writeFileSync(DB_PATH, JSON.stringify({ users: {}, stats: [] }, null, 2));
  }
  const raw = fs.readFileSync(DB_PATH, 'utf8');
  return JSON.parse(raw);
}
function writeDB(db) { fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2)); }

async function seed() {
  const db = readDB();
  // seed a demo user
  const uid = 'fengwei_demo';
  db.users[uid] = {
    uid,
    email: 'fengwei@example.com',
    passwordHash: require('bcrypt').hashSync('demo123', 10),
    displayName: 'FENGWEI',
    photoURL: '',
    lastLogin: new Date().toISOString(),
    countdowns: {
      global_2063: {
        id: 'global_2063',
        title: '全球生日倒计时',
        targetDateISO: '2063-11-18T12:00:00+08:00',
        timezone: 'Asia/Shanghai',
        format: 'YYYY-MM-DD HH:mm:ss',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        settings: { showSeconds: true }
      }
    }
  };
  db.stats.push({ uid, event: 'seed', timestamp: new Date().toISOString(), details: 'demo seed' });
  writeDB(db);
  console.log('Demo backend data seeded.');
}
seed().catch(console.error);

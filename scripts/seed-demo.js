// Seeds a demo dataset into Firestore using Firebase Admin SDK
// NOTE: This script requires a Firebase service account json file at
// ./serviceAccountKey.json. Do not commit your real credentials.

const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function seed() {
  const uid = 'fengwei_demo';
  const now = new Date();

  await db.collection('users').doc(uid).set({
    profile: {
      displayName: 'FENGWEI',
      photoURL: '',
      email: 'fengwei@example.com',
      lastLogin: now.toISOString()
    }
  });

  const countdowns = [
    {
      id: 'global_2063',
      title: '全球生日倒计时',
      targetDateISO: '2063-11-18T12:00:00+08:00',
      timezone: 'Asia/Shanghai',
      format: 'YYYY-MM-DD HH:mm:ss',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      settings: { showSeconds: true }
    },
    {
      id: 'father_bday_2040',
      title: '父亲生日演示',
      targetDateISO: '2040-04-01T00:00:00+08:00',
      timezone: 'Asia/Shanghai',
      format: 'YYYY-MM-DD HH:mm:ss',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      settings: { showSeconds: false }
    }
  ];

  const batch = db.batch();
  const userCountdownsCol = db.collection('users').doc(uid).collection('countdowns');
  for (const c of countdowns) {
    const ref = userCountdownsCol.doc(c.id);
    batch.set(ref, {
      id: c.id,
      title: c.title,
      targetDateISO: c.targetDateISO,
      timezone: c.timezone,
      format: c.format,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
      settings: c.settings
    });
  }
  batch.set(db.collection('stats').doc(), {
    uid: uid,
    event: 'demo_seed',
    timestamp: now.toISOString(),
    details: 'seeded demo dataset'
  });

  await batch.commit();
  console.log('Demo data seeded into Firestore.');
}

seed().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});

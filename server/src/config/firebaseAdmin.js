const admin = require('firebase-admin');

let firebaseApp;

function initializeFirebaseAdmin() {
  if (firebaseApp) {
    return firebaseApp;
  }

  if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) {
    throw new Error('Firebase admin credentials are missing');
  }

  firebaseApp = admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    })
  });

  return firebaseApp;
}

module.exports = { initializeFirebaseAdmin };

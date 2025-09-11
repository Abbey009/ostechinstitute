import admin from 'firebase-admin';
import serviceAccount from '../firebase-admin-key.json';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const setAdminRole = async (uid: string) => {
  await admin.auth().setCustomUserClaims(uid, { admin: true });
  console.log(`Admin role set for user ${uid}`);
};

setAdminRole('KHLzUUmoGiNHrxsekm7GWjKKEhF2'); // Replace with your UID

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBJhKqsj6tsoshcOskxK3CpFlW4mz_0yk8",
  authDomain: "techstack-academy.firebaseapp.com",
  projectId: "techstack-academy",
  storageBucket: "techstack-academy.firebasestorage.app",
  messagingSenderId: "963561798116",
  appId: "1:963561798116:web:a95cc7d825df82ff532ff1",
  measurementId: "G-PP01CZYM09"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Only initialize analytics in the browser
let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { auth, db };

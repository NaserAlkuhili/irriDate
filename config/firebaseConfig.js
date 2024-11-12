import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';  // Import the Firebase Auth module

const firebaseConfig = {
  apiKey: "AIzaSyCov5O9PmWTmpxV1y6hA-X_Cwam56wilOo",
  authDomain: "irridate-30465.firebaseapp.com",
  projectId: "irridate-30465",
  storageBucket: "irridate-30465.appspot.com",
  messagingSenderId: "413725349142",
  appId: "1:413725349142:web:cbf6413deb2c7b1bc42c37",
  measurementId: "G-1HSJTSQLKM"
};

// Initialize Firebase using the modular syntax
const app = initializeApp(firebaseConfig);

// Get the Firebase Authentication instance
const auth = getAuth(app);

export { app, auth };

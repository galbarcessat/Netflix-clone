// Import the specific Firebase services you need
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your Firebase config object
const firebaseConfig = {
  apiKey: "AIzaSyBEy-4iCa0D4_ovcvu4RcQdoXbD0tBXIu4",
  authDomain: "netflix-clone-37f06.firebaseapp.com",
  projectId: "netflix-clone-37f06",
  storageBucket: "netflix-clone-37f06.appspot.com",
  messagingSenderId: "762225280095",
  appId: "1:762225280095:web:873fb005cf4061a06407ea"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Export the Firebase services you need
const auth = getAuth(app)
const db = getFirestore(app)

export { db, auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged };

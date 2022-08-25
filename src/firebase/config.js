import firebase from 'firebase/app';

import 'firebase/analytics';
import 'firebase/auth';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDYEWul1sv1OylOeJc095h1djL9_JwSsJQ",
  authDomain: "chat-app-6e584.firebaseapp.com",
  projectId: "chat-app-6e584",
  storageBucket: "chat-app-6e584.appspot.com",
  messagingSenderId: "238440669011",
  appId: "1:238440669011:web:cb5db594fda558d0c70ba6",
  measurementId: "G-DT06Z0JBND"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

const auth = firebase.auth();
const db = firebase.firestore();

if (window.location.hostname === 'localhost') {
    auth.useEmulator('http://localhost:9099');
    db.useEmulator('localhost', '8080');
}

export { db, auth };
export default firebase;

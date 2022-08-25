import firebase from 'firebase/app';

import 'firebase/analytics';
import 'firebase/auth';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC4RXlfsv7TB2CUmVKmSuPpr-VqqweK1Zw",
  authDomain: "chat-realtime-f823e.firebaseapp.com",
  projectId: "chat-realtime-f823e",
  storageBucket: "chat-realtime-f823e.appspot.com",
  messagingSenderId: "1097095430902",
  appId: "1:1097095430902:web:36425260e1230c7b4762d7",
  measurementId: "G-RFGCT8RDE7"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

const auth = firebase.auth();
const db = firebase.firestore();
if (window.location.hostname === 'localhost') {
    //  auth.useEmulator('http://localhost:9099');
    //  db.useEmulator('localhost', '8080');
}

export { db, auth };
export default firebase;

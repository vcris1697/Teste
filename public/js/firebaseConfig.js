/* ============================================================
   js/firebaseConfig.js
   ============================================================ */

import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.3.0/firebase-app.js';
import { getAuth }       from 'https://www.gstatic.com/firebasejs/11.3.0/firebase-auth.js';
import { getFirestore }  from 'https://www.gstatic.com/firebasejs/11.3.0/firebase-firestore.js';

const firebaseConfig = {
  apiKey:            "AIzaSyDgY9tKtCrFX3A52UXiX2Ai-TTLQ9SPx9M",
  authDomain:        "portalsaudesm.firebaseapp.com",
  databaseURL:       "https://portalsaudesm-default-rtdb.firebaseio.com",
  projectId:         "portalsaudesm",
  storageBucket:     "portalsaudesm.firebasestorage.app",
  messagingSenderId: "1066556475359",
  appId:             "1:1066556475359:web:5cff04e87c73ef9d99666a"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db   = getFirestore(app);
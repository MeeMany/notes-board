// src/config/firebase.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBtucAs5u9xEMKs8G7W12hbVnFSTORU6K8",
    authDomain: "notes-board-d3a7f.firebaseapp.com",
    projectId: "notes-board-d3a7f",
    storageBucket: "notes-board-d3a7f.firebasestorage.app",
    messagingSenderId: "728183735165",
    appId: "1:728183735165:web:e9a927db136b2db26c4214"
  };

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
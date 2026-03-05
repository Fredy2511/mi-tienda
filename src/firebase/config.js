import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAl1L79QsHBWldhxL20ZwT6PNEhNT_6WEw",
  authDomain: "practica-nosql-b024d.firebaseapp.com",
  projectId: "practica-nosql-b024d",
  storageBucket: "practica-nosql-b024d.firebasestorage.app",
  messagingSenderId: "923932449782",
  appId: "1:923932449782:web:b122e5372221d0fd8085d7"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

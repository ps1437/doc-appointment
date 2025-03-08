import { initializeApp } from "firebase/app";
import { getFirestore, collection, query, where, getDocs, addDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB-rCgfEecvSSXd_XeneOYepX19Ty-z-VA",
  authDomain: "appointment-eda18.firebaseapp.com",
  projectId: "appointment-eda18",
  storageBucket: "appointment-eda18.firebasestorage.app",
  messagingSenderId: "1094166274462",
  appId: "1:1094166274462:web:a9ebcdf758d4e6e1afb68f",
  measurementId: "G-V0DT2LBBXW"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, query, where, getDocs, addDoc };

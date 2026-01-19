import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDPzO2SsUq45pCwQ1fF1lfWUdZWWPG0t2o",
    authDomain: "cancer-football.firebaseapp.com",
    projectId: "cancer-football",
    storageBucket: "cancer-football.firebasestorage.app",
    messagingSenderId: "711636091876",
    appId: "1:711636091876:web:0998350d30a0b6f3a87df1",
    measurementId: "G-SPQ855KRBQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
export const auth = getAuth(app);

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBLux-w0fSuVl_4FAzykgTczSG_j5vr2tw",
    authDomain: "cartrac-9689b.firebaseapp.com",
    projectId: "cartrac-9689b",
    storageBucket: "cartrac-9689b.firebasestorage.app",
    messagingSenderId: "240874173367",
    appId: "1:240874173367:web:0f71555031cb5aa1112e32",
    measurementId: "G-27MXSYN8KK"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

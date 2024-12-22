import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyCgmlHk1iTtUEbk9GFg1qwN6n3jNOkNOac",
    authDomain: "assistia-42689.firebaseapp.com",
    databaseURL: "https://assistia-42689-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "assistia-42689",
    storageBucket: "assistia-42689.firebasestorage.app",
    messagingSenderId: "1049295150349",
    appId: "1:1049295150349:web:e715877865452ea4dba444",
    measurementId: "G-2NZL6SDRWQ"
  };

const app = initializeApp(firebaseConfig);

export const database = getDatabase(app);

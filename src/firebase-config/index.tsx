import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyChGzMCUJpquchIQ7nJsikwPK4l710xcvU",
  authDomain: "now-chat-1234.firebaseapp.com",
  projectId: "now-chat-1234",
  storageBucket: "now-chat-1234.appspot.com",
  messagingSenderId: "69863280784",
  appId: "1:69863280784:web:eecca30640923c58f20815",
  measurementId: "G-TSSCZG8XSY",
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

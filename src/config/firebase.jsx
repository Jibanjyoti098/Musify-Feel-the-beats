import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC7hbbjbcWVJHVO1428TJDfVfqGkKbCVOw",
  authDomain: "musify-97624.firebaseapp.com",
  projectId: "musify-97624",
  storageBucket: "musify-97624.firebasestorage.app",
  messagingSenderId: "574252209641",
  appId: "1:574252209641:web:f309fb5f34f5305c166778"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
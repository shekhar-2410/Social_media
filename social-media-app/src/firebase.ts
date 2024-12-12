import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAvoFW0gJCoqk7a--PpGn5M21kXzVTTbTM",
  authDomain: "social-media-aaa1b.firebaseapp.com",
  projectId: "social-media-aaa1b",
  storageBucket: "social-media-aaa1b.appspot.com",
  messagingSenderId: "945749573375",
  appId: "1:945749573375:web:050d0c2d0fe2568c3156ca",
  measurementId: "G-KNL2H442TJ",
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const analytics = getAnalytics(app);

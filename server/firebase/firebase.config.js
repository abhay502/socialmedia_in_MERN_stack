// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAy_IYYlnafWUbkY6WAeo9_Xi32Y-8XZOo",
  authDomain: "social-media-e5473.firebaseapp.com",
  projectId: "social-media-e5473",
  storageBucket: "social-media-e5473.appspot.com",
  messagingSenderId: "365492875218",
  appId: "1:365492875218:web:5ce649310f26f662c5e20b",
  measurementId: "G-Q29J8X9YQ9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

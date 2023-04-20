

 import firebase from "firebase/app";
import "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAeB6BIqk9fjLoEGeXFikCuonu-wZZDFYU",
    authDomain: "otplogin-83b1f.firebaseapp.com",
    projectId: "otplogin-83b1f",
    storageBucket: "otplogin-83b1f.appspot.com",
    messagingSenderId: "1037007339568",
    appId: "1:1037007339568:web:9acdb07cc8b6571e056df5",
    measurementId: "G-95KJ0C642E"
}; 

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();

 
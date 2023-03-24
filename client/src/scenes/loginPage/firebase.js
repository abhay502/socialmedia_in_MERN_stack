

import {initializeApp} from 'firebase/app';
import { getAuth } from "firebase/auth";



  



const firebaseConfig = {
    apiKey: "AIzaSyAy_IYYlnafWUbkY6WAeo9_Xi32Y-8XZOo",
    authDomain: "social-media-e5473.firebaseapp.com",
    projectId: "social-media-e5473",
    storageBucket: "social-media-e5473.appspot.com",
    messagingSenderId: "365492875218",
    appId: "1:365492875218:web:5ce649310f26f662c5e20b", 
    measurementId: "G-Q29J8X9YQ9" 
  };


  const app = initializeApp(firebaseConfig);
  export const auth = getAuth(app);
  export default app;
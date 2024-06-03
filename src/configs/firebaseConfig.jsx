// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "@firebase/app";
import { getAuth } from "@firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBAwJs0yYf4B_ePhIG18Z0tskYnF1YU8w8",
    authDomain: "app-chat-422113.firebaseapp.com",
    projectId: "app-chat-422113",
    storageBucket: "app-chat-422113.appspot.com",
    messagingSenderId: "765557075609",
    appId: "1:765557075609:web:c924cd77ecb647a4395208",
    measurementId: "G-84TLL8T87W"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
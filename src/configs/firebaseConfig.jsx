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

// const firebaseConfig = {
//     apiKey: "AIzaSyDoNpR_1s0ey2ON3km_scFTffMEtGOf7YI",
//     authDomain: "bang-2e904.firebaseapp.com",
//     projectId: "bang-2e904",
//     storageBucket: "bang-2e904.appspot.com",
//     messagingSenderId: "1035224171288",
//     appId: "1:1035224171288:web:fc6af3b47faea07498146d",
//     measurementId: "G-7F4YN9FE8M"
// };



const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
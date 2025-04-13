// src/Components/Db/FireBase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBxBdZZ1oswp1qgjOT4PVb1oL5DsQuiPgg",
  authDomain: "trabalhofinalloja.firebaseapp.com",
  databaseURL: "https://trabalhofinalloja-default-rtdb.firebaseio.com",
  projectId: "trabalhofinalloja",
  storageBucket: "trabalhofinalloja.appspot.com",
  messagingSenderId: "926154359130",
  appId: "1:926154359130:web:90ba82aa123a0f4a9b3363"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };

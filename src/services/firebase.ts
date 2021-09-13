import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

var firebaseConfig = {
    apiKey: "AIzaSyBfcQjjr0ySszBXePPmX74gnenDYga8bM4",
    authDomain: "letmeask-7804b.firebaseapp.com",
    databaseURL: "https://letmeask-7804b-default-rtdb.firebaseio.com",
    projectId: "letmeask-7804b",
    storageBucket: "letmeask-7804b.appspot.com",
    messagingSenderId: "724788943583",
    appId: "1:724788943583:web:dbee9e813ca9688692276a",
    measurementId: "G-QMPET78ZRS"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
//firebase.analytics();

const auth = firebase.auth();
const database = firebase.database();

export { auth, database, firebase };
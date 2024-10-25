const firebaseConfig = {
    apiKey: "AIzaSyAdS3J9Xc2_vcC2R6ETrE2ih_rAhC3pcd0",
    authDomain: "proyecto4-76bd0.firebaseapp.com",
    projectId: "proyecto4-76bd0",
    storageBucket: "proyecto4-76bd0.appspot.com",
    messagingSenderId: "921987791644",
    appId: "1:921987791644:web:c9638210c7df750b23d8d9",
    measurementId: "G-YER3SCV6Y7"
};

// Inicializar Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
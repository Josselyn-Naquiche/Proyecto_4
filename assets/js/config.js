// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAK2XwjNw553jLxXtipNNVnI53A64fnDHM",
    authDomain: "proyecto4-e0675.firebaseapp.com",
    projectId: "proyecto4-e0675",
    storageBucket: "proyecto4-e0675.appspot.com",
    messagingSenderId: "512574537773",
    appId: "1:512574537773:web:4503d5bb365fc881e6f8a4",
    measurementId: "G-3EMBHPK9DL"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);

// Inicializar servicios
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// Configurar persistencia offline
db.enablePersistence()
    .catch(err => {
        if (err.code == 'failed-precondition') {
            console.error('Error: Múltiples pestañas abiertas');
        } else if (err.code == 'unimplemented') {
            console.error('Error: Navegador no soportado');
        }
    });
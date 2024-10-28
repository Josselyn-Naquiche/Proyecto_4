// Importar la configuración de Firebase
import { auth } from './config.js';

// Elementos del DOM
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerNewUserForm');
const loginGoogleBtn = document.getElementById('loginGoogleBtn');
const showRegisterForm = document.getElementById('showRegisterForm');
const registerDiv = document.getElementById('registerForm');
const mainButtons = document.getElementById('main-buttons');
const errorMessage = document.getElementById('error-message');
const backToMain = document.getElementById('backToMain2');

// Mostrar/ocultar formularios
showRegisterForm.addEventListener('click', () => {
    registerDiv.classList.remove('d-none');
    mainButtons.classList.add('d-none');
    loginForm.classList.add('d-none');
});

backToMain.addEventListener('click', () => {
    registerDiv.classList.add('d-none');
    mainButtons.classList.remove('d-none');
    loginForm.classList.remove('d-none');
});

// Login con email y contraseña
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        await auth.signInWithEmailAndPassword(email, password);
        window.location.href = 'index.html';
    } catch (error) {
        mostrarError(error.message);
    }
});

// Registro de nuevo usuario
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    try {
        await auth.createUserWithEmailAndPassword(email, password);
        alert('Usuario registrado exitosamente');
        registerDiv.classList.add('d-none');
        mainButtons.classList.remove('d-none');
        loginForm.classList.remove('d-none');
    } catch (error) {
        mostrarError(error.message);
    }
});

// Login con Google
loginGoogleBtn.addEventListener('click', async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
        await auth.signInWithPopup(provider);
        window.location.href = 'index.html';
    } catch (error) {
        mostrarError(error.message);
    }
});

// Función para mostrar errores
function mostrarError(mensaje) {
    errorMessage.textContent = mensaje;
    errorMessage.classList.remove('d-none');
    setTimeout(() => {
        errorMessage.classList.add('d-none');
    }, 3000);
}

// Verificar estado de autenticación
auth.onAuthStateChanged((user) => {
    if (user) {
        window.location.href = 'index.html';
    }
});
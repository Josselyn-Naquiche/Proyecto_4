<<<<<<< HEAD
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
=======
$(document).ready(function() {
  const provider = new firebase.auth.GoogleAuthProvider();
  const defaultAvatar = "https://via.placeholder.com/100";

  $('#showRegisterForm').click(function () {
    $('#registerForm').removeClass('d-none');
    $('#main-buttons').addClass('d-none');
    $('#loginEmailForm').addClass('d-none')
  });


  $('#backToMain2').click(function() {
      $('#registerForm').addClass('d-none');
      $('#main-buttons').removeClass('d-none');
      $('#loginEmailForm').removeClass('d-none')
  });

  $('#registerNewUserForm').submit(function(event) {
      event.preventDefault();
      const email = $('#registerEmail').val();
      const password = $('#registerPassword').val();

      auth.createUserWithEmailAndPassword(email, password)
          .then(function(userCredential) {
              window.location.href = "index.html";
          })
          .catch(function(error) {
              console.error("Error al registrar", error.code, error.message);
              alert("Error al registrar: " + error.message);
          });
  });



  $('#loginForm').submit(function(event) {
      event.preventDefault();
      const email = $('#loginEmail').val();
      const password = $('#loginPassword').val();

      auth.signInWithEmailAndPassword(email, password)
          .then(function(userCredential) {
              window.location.href = "index.html";
          })
          .catch(function(error) {
              console.error("Error al iniciar sesión:", error.code, error.message);
              alert("Error al iniciar sesión: " + error.message);
          });
  });

  $('#logout').click(function() {
      auth.signOut().then(function() {
          $('#welcomeSection').addClass('d-none');
          $('#main-buttons').removeClass('d-none');
          $('#logout').addClass('d-none');
      }).catch(function(error) {
          console.error("Error al cerrar sesión:", error);
      });
  });

  $('#loginGoogleBtn').click(function() {
      auth.signInWithPopup(provider)
          .then(function(result) {
              window.location.href = "index.html";
          })
          .catch(function(error) {
              console.error("Error al registrar", error.code, error.message);
              alert("Error al registrar: " + error.message);
          });
  });

  auth.onAuthStateChanged(function(user) {
      if (user) {
          const displayName = user.displayName || user.email.split('@')[0];
          const photoURL = user.photoURL || defaultAvatar;

          $('#userName').text(displayName);
          $('#userAvatar').attr('src', photoURL);
          $('#welcomeSection').removeClass('d-none');
          $('#main-buttons').addClass('d-none');
        //   $('#loginEmailForm').addClass('d-none');
          $('#registerForm').addClass('d-none');
          $('#logout').removeClass('d-none');
      } else {
          $('#welcomeSection').addClass('d-none');
          $('#main-buttons').removeClass('d-none');
        //   $('#loginEmailForm').addClass('d-none');
          $('#registerForm').addClass('d-none');
          $('#logout').addClass('d-none');
          $('#userName').text('');
          $('#userAvatar').attr('src', defaultAvatar);
      }
  });
});
>>>>>>> d89dc46e3a7f1907e633edc5b89fb90ca63c8b3b

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
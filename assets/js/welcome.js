$(document).ready(function(){
    // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyAdS3J9Xc2_vcC2R6ETrE2ih_rAhC3pcd0",
    authDomain: "proyecto4-76bd0.firebaseapp.com",
    projectId: "proyecto4-76bd0",
    storageBucket: "proyecto4-76bd0.appspot.com",
    messagingSenderId: "921987791644",
    appId: "1:921987791644:web:c9638210c7df750b23d8d9",
    measurementId: "G-YER3SCV6Y7"
};

// Initialize Firebase
  const app = firebase.initializeApp(firebaseConfig);
  console.log(app)
  const auth = firebase.auth();
  const db = firebase.firestore();


//Crear proveedor de google
  const provider = new firebase.auth.GoogleAuthProvider();

// boton Registrarse
  $('#showRegisterForm').click(function () {
      $('#registerForm').removeClass('d-none');
      $('#main-buttons').addClass('d-none');
    });

//Botoon volver del registro
  $('#backToMain2').click(function(){
  $('#registerForm').addClass('d-none')
  $('#main-buttons').removeClass('d-none')
  })

//REGISTRARSE
  $('#registerNewUserForm').submit(function(){
    event.preventDefault();
    const email = $('#registerEmail').val()
    const password = $('#registerPassword').val()

  auth.createUserWithEmailAndPassword(email, password)
    .then(function(userCredential){
       window.location.href = "index.html";

    })
    .catch(function (error){
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Error al registrar", errorCode, errorMessage)
      alert("Error al registrar" + errorMessage)
      
    })
})


 //BOTON DE INICIAR SESIÓN
 $('#loginEmailBtn').click(function(){
  $('#loginEmailForm').removeClass('d-none')
  $('#main-buttons').addClass('d-none')
})

//Botoon volver del iniciar sesion
  $('#backToMain1').click(function(){
    $('#loginEmailForm').addClass('d-none')
    $('#main-buttons').removeClass('d-none')
  })

  $('#loginForm').submit(function(){
    event.preventDefault();
    const email = $('#loginEmail').val()
    const password = $('#loginPassword').val()

    auth.signInWithEmailAndPassword(email, password)
    .then(function (userCredential) {
        console.log("Inicio de sesión exitoso. ¡Bienvenido de nuevo!");
        window.location.href = "index.html"
        
    })
    .catch(function (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error("Error al iniciar sesión:", errorCode, errorMessage);
        alert("Error al iniciar sesión: " + errorMessage);
    });
    })


//Boton de cerrar sesión

$('#logout').click(function() {
  auth.signOut().then(function() {
    
    $('#welcomeSection').addClass('d-none'); // Ocultar sección de bienvenida
    $('#main-buttons').removeClass('d-none'); // Mostrar botones principales
    $('#logout').addClass('d-none')
    
    }).catch(function(error) {
  console.error("Error al cerrar sesión:", error);
    });
  });

  $('#loginGoogleBtn').click(function(){
    auth.signInWithPopup(provider)
    .then(function(result){
        window.location.href = "index.html"
    })
    .catch(function (error){
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Error al registrar", errorCode, errorMessage)
      alert("Error al registrar" + errorMessage)
      
    })
  })

auth.onAuthStateChanged(function(user){
    if (user) {
        console.log(user);
        // Usuario autenticado
        const displayName = user.displayName || user.email.split('@')[0];
        

        $('#userName').text(displayName);
        
        $('#welcomeSection').removeClass('d-none'); //Se muestra la seccion de bienvenida con el nombre y el avatar del usuario.
        $('#main-buttons').addClass('d-none'); // Se ocultan los botones principales
        $('#loginEmailForm').addClass('d-none');// se oculta formulario de sesion.
        $('#registerForm').addClass('d-none'); // se oculta formulario de registro.
        $('#logout').removeClass('d-none'); //Se muestra el botón de cerrar sesión.

        // Cargar los datos al iniciar sesión
        cargarDatos();
    } else {
        // Usuario no autenticado
        $('#welcomeSection').addClass('d-none');
        $('#main-buttons').removeClass('d-none');
        $('#loginEmailForm').addClass('d-none');
        $('#registerForm').addClass('d-none');
        $('#logout').addClass('d-none');
        $('#userName').text('');
        
    }
})
  

})


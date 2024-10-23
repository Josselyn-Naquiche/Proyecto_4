$(document).ready(function () {
    // Configuración de Firebase (el mismo que en la otra página)
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
  
    // Verificar si el usuario está autenticado
    auth.onAuthStateChanged(function (user) {
      if (user) {
        const displayName = user.displayName || user.email.split('@')[0];
        const avatarURL = user.photoURL || 'https://via.placeholder.com/100';
  
        // Mostrar los datos en la sección de bienvenida
        $('#userName').text(displayName);
        $('#userAvatar').attr('src', avatarURL);
  
        // Mostrar la sección de bienvenida
        $('#welcomeSection').removeClass('d-none');
      } else {
        // Si no hay usuario autenticado, redirigir a la página de inicio de sesión
        window.location.href = "welcome.html";
      }
    });
  
    // Botón de cerrar sesión
    $('#logout').click(function () {
      auth.signOut().then(function () {
        window.location.href = "login.html";
      }).catch(function (error) {
        console.error("Error al cerrar sesión:", error);
      });
    });
  });
  
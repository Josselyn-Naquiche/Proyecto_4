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


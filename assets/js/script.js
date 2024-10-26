$(document).ready(function() {
  auth.onAuthStateChanged(function(user) {
      if (user) {
          const displayName = user.displayName || user.email.split('@')[0];
          const avatarURL = user.photoURL || 'https://via.placeholder.com/100';

          $('#userName').text(displayName);
          $('#userAvatar').attr('src', avatarURL);
          $('#welcomeSection').removeClass('d-none');
      } else {
          window.location.href = "welcome.html";
      }
  });

  $('#logout').click(function() {
      auth.signOut().then(function() {
          window.location.href = "welcome.html";
      }).catch(function(error) {
          console.error("Error al cerrar sesión:", error);
      });
  });
});
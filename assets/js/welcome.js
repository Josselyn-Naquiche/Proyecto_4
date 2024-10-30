$(document).ready(function() {
    const provider = new firebase.auth.GoogleAuthProvider();
    const defaultAvatar = "https://via.placeholder.com/100";

    // Mostrar formulario de registro
    $('#showRegisterForm').click(function() {
        $('#registerForm').removeClass('d-none');
        $('#main-buttons').addClass('d-none');
        $('#error-message').addClass('d-none');
    });

    // Volver desde registro
    $('#backToMain2').click(function() {
        $('#registerForm').addClass('d-none');
        $('#main-buttons').removeClass('d-none');
        $('#error-message').addClass('d-none');
    });

    // Registro de nuevo usuario
    $('#registerNewUserForm').submit(function(event) {
        event.preventDefault();
        const email = $('#registerEmail').val();
        const password = $('#registerPassword').val();

        if (password.length < 6) {
            $('#error-message')
                .removeClass('d-none')
                .text("La contraseña debe tener al menos 6 caracteres");
            return;
        }

        auth.createUserWithEmailAndPassword(email, password)
            .then(function() {
                window.location.href = "index.html";
            })
            .catch(function(error) {
                let mensaje = "Error al registrar: ";
                switch (error.code) {
                    case 'auth/email-already-in-use':
                        mensaje += "El correo ya está registrado";
                        break;
                    case 'auth/invalid-email':
                        mensaje += "Correo inválido";
                        break;
                    default:
                        mensaje += "Por favor, verifica tus datos";
                }
                $('#error-message')
                    .removeClass('d-none')
                    .text(mensaje);
            });
    });

    // Mostrar formulario de login
    $('#loginEmailBtn').click(function() {
        $('#loginEmailForm').removeClass('d-none');
        $('#main-buttons').addClass('d-none');
        $('#error-message').addClass('d-none');
    });

    // Volver desde login
    $('#backToMain1').click(function() {
        $('#loginEmailForm').addClass('d-none');
        $('#main-buttons').removeClass('d-none');
        $('#error-message').addClass('d-none');
    });

    // Login con email
    $('#loginForm').submit(function(event) {
        event.preventDefault();
        const email = $('#loginEmail').val();
        const password = $('#loginPassword').val();

        auth.signInWithEmailAndPassword(email, password)
            .then(function() {
                window.location.href = "index.html";
            })
            .catch(function(error) {
                let mensaje = "Error al iniciar sesión: ";
                switch (error.code) {
                    case 'auth/user-not-found':
                        mensaje += "Usuario no encontrado";
                        break;
                    case 'auth/wrong-password':
                        mensaje += "Contraseña incorrecta";
                        break;
                    default:
                        mensaje += "Por favor, verifica tus datos";
                }
                $('#error-message')
                    .removeClass('d-none')
                    .text(mensaje);
            });
    });

    // Login con Google
    $('#loginGoogleBtn').click(function() {
        auth.signInWithPopup(provider)
            .then(function() {
                window.location.href = "index.html";
            })
            .catch(function(error) {
                $('#error-message')
                    .removeClass('d-none')
                    .text("Error al iniciar sesión con Google. Por favor, intenta nuevamente.");
            });
    });

    // Cerrar sesión
    $('#logout').click(function() {
        auth.signOut()
            .then(function() {
                $('#welcomeSection').addClass('d-none');
                $('#main-buttons').removeClass('d-none');
                $('#logout').addClass('d-none');
                $('#userName').text('');
                $('#userAvatar').attr('src', defaultAvatar);
            })
            .catch(function(error) {
                console.error("Error al cerrar sesión:", error);
            });
    });

    // Verificar estado de autenticación
    auth.onAuthStateChanged(function(user) {
        if (user) {
            const displayName = user.displayName || user.email.split('@')[0];
            const photoURL = user.photoURL || defaultAvatar;

            $('#userName').text(displayName);
            $('#userAvatar').attr('src', photoURL);
            $('#welcomeSection').removeClass('d-none');
            $('#main-buttons').addClass('d-none');
            $('#loginEmailForm').addClass('d-none');
            $('#registerForm').addClass('d-none');
            $('#logout').removeClass('d-none');
            
            window.location.href = "index.html";
        } else {
            $('#welcomeSection').addClass('d-none');
            $('#main-buttons').removeClass('d-none');
            $('#loginEmailForm').addClass('d-none');
            $('#registerForm').addClass('d-none');
            $('#logout').addClass('d-none');
            $('#userName').text('');
            $('#userAvatar').attr('src', defaultAvatar);
        }
    });
});
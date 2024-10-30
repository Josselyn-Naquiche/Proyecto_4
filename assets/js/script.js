$(document).ready(function() {
    // Verificar autenticación
    auth.onAuthStateChanged(user => {
        if (!user) {
            window.location.href = 'welcome.html';
            return;
        }

        // Configurar UI con datos del usuario
        $('#userDisplayName').text(user.displayName || user.email.split('@')[0]);
        $('#userAvatar').attr('src', user.photoURL || 'https://via.placeholder.com/40');
        
        // Cargar posts existentes
        cargarPosts();
    });

    // Crear nuevo post
    $('#postForm').submit(function(e) {
        e.preventDefault();
        const texto = $('#postText').val().trim();
        const imagen = $('#postImage')[0].files[0];

        if (!texto && !imagen) {
            alert('Por favor, escribe algo o selecciona una imagen');
            return;
        }

        $('#loadingSpinner').removeClass('d-none');
        
        crearPost(texto, imagen)
            .then(() => {
                $('#postText').val('');
                $('#postImage').val('');
                $('#imagePreview').addClass('d-none');
                $('#loadingSpinner').addClass('d-none');
            })
            .catch(error => {
                console.error("Error al crear post:", error);
                alert("No se pudo crear la publicación. Por favor, intenta nuevamente.");
                $('#loadingSpinner').addClass('d-none');
            });
    });

    // Función para crear post
    function crearPost(texto, imagen) {
        const post = {
            autorId: auth.currentUser.uid,
            autorNombre: auth.currentUser.displayName || auth.currentUser.email.split('@')[0],
            autorFoto: auth.currentUser.photoURL || 'https://via.placeholder.com/40',
            texto: texto,
            fecha: firebase.firestore.FieldValue.serverTimestamp(),
            likes: {},
            dislikes: {}
        };

        if (imagen) {
            const nombreArchivo = `${Date.now()}_${imagen.name}`;
            const refStorage = storage.ref(`posts/${auth.currentUser.uid}/${nombreArchivo}`);
            
            return refStorage.put(imagen)
                .then(snapshot => snapshot.ref.getDownloadURL())
                .then(url => {
                    post.imagenUrl = url;
                    return db.collection('posts').add(post);
                });
        }

        return db.collection('posts').add(post);
    }

    // Cargar posts en tiempo real
    function cargarPosts() {
        db.collection('posts')
            .orderBy('fecha', 'desc')
            .onSnapshot(snapshot => {
                $('#postsContainer').empty();
                snapshot.forEach(doc => {
                    const post = doc.data();
                    const postHtml = crearElementoPost(doc.id, post);
                    $('#postsContainer').append(postHtml);
                });
            }, error => {
                console.error("Error al cargar posts:", error);
                alert("Error al cargar las publicaciones. Por favor, actualiza la página.");
            });
    }

    // Crear elemento HTML del post
    function crearElementoPost(postId, post) {
        const tienelike = post.likes && post.likes[auth.currentUser.uid];
        const tienedislike = post.dislikes && post.dislikes[auth.currentUser.uid];
        const cantidadLikes = post.likes ? Object.keys(post.likes).length : 0;
        const cantidadDislikes = post.dislikes ? Object.keys(post.dislikes).length : 0;
        const fecha = post.fecha ? new Date(post.fecha.toDate()).toLocaleString() : 'Ahora';
    
        return `
            <div class="card mb-4 post-card">
                <div class="card-header">
                    <div class="d-flex align-items-center">
                        <img src="${post.autorFoto}" class="rounded-circle me-2" width="40" height="40" alt="Foto de perfil">
                        <div>
                            <h6 class="mb-0">${post.autorNombre}</h6>
                            <small class="text-muted">${fecha}</small>
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <p class="card-text">${post.texto}</p>
                    ${post.imagenUrl ? `
                        <div class="post-image-container mb-3">
                            <img src="${post.imagenUrl}" class="img-fluid rounded" alt="Imagen del post">
                        </div>
                    ` : ''}
                    <div class="d-flex gap-2">
                        <button class="btn btn-sm ${tienelike ? 'btn-primary' : 'btn-outline-primary'}" 
                                onclick="manejarLike('${postId}')">
                            <i class="bi bi-hand-thumbs-up"></i> ${cantidadLikes}
                        </button>
                        <button class="btn btn-sm ${tienedislike ? 'btn-danger' : 'btn-outline-danger'}" 
                                onclick="manejarDislike('${postId}')">
                            <i class="bi bi-hand-thumbs-down"></i> ${cantidadDislikes}
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // Preview de imagen
    $('#postImage').change(function() {
        const archivo = this.files[0];
        if (archivo) {
            const reader = new FileReader();
            reader.onload = function(e) {
                $('#imagePreview')
                    .attr('src', e.target.result)
                    .removeClass('d-none');
            };
            reader.readAsDataURL(archivo);
        } else {
            $('#imagePreview')
                .addClass('d-none')
                .attr('src', '');
        }
    });

    // Logout
    $('#logout').click(() => {
        auth.signOut()
            .then(() => window.location.href = 'welcome.html')
            .catch(error => {
                console.error("Error al cerrar sesión:", error);
                alert("Error al cerrar sesión. Por favor, intenta nuevamente.");
            });
    });
});

// Funciones globales para likes/dislikes
window.manejarLike = function(postId) {
    const userId = auth.currentUser.uid;
    const postRef = db.collection('posts').doc(postId);
    
    postRef.get().then(doc => {
        if (!doc.exists) return;
        
        const post = doc.data();
        const likes = {...post.likes};
        const dislikes = {...post.dislikes};
        
        if (likes[userId]) {
            delete likes[userId];
        } else {
            likes[userId] = true;
            delete dislikes[userId];
        }
        
        postRef.update({ likes, dislikes });
    });
};

window.manejarDislike = function(postId) {
    const userId = auth.currentUser.uid;
    const postRef = db.collection('posts').doc(postId);
    
    postRef.get().then(doc => {
        if (!doc.exists) return;
        
        const post = doc.data();
        const likes = {...post.likes};
        const dislikes = {...post.dislikes};
        
        if (dislikes[userId]) {
            delete dislikes[userId];
        } else {
            dislikes[userId] = true;
            delete likes[userId];
        }
        
        postRef.update({ likes, dislikes });
    });
};
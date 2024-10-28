import { auth, db } from "./config.js";

// Referencias a elementos del DOM
const postForm = document.getElementById('post-form');
const postInput = document.getElementById('post-input');
const postsContainer = document.getElementById('posts-container');

// Verificar estado de autenticación
auth.onAuthStateChanged((user) => {
    if (user) {
        $('#userName').text(user.displayName || user.email.split('@')[0]);
        $('#userAvatar').attr('src', user.photoURL || 'https://via.placeholder.com/40');
        loadPosts();
    } else {
        window.location.href = "welcome.html";
    }
});

// Crear nueva publicación
async function createPost(content) {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error('No hay usuario autenticado');

        await db.collection('posts').add({
            content: content,
            userId: user.uid,
            userEmail: user.email,
            userName: user.displayName || user.email.split('@')[0],
            userPhoto: user.photoURL || 'https://via.placeholder.com/40',
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            likes: 0,
            comments: []
        });

        postInput.value = '';
        showMessage('¡Publicación creada con éxito!', 'success');
    } catch (error) {
        showMessage('Error al crear la publicación: ' + error.message, 'danger');
    }
}

// Cargar publicaciones
function loadPosts() {
    db.collection('posts')
        .orderBy('timestamp', 'desc')
        .onSnapshot((snapshot) => {
            postsContainer.innerHTML = '';
            
            if (snapshot.empty) {
                postsContainer.innerHTML = '<p class="text-center text-muted">No hay publicaciones aún</p>';
                return;
            }

            snapshot.forEach((doc) => {
                const post = doc.data();
                const postDate = post.timestamp ? new Date(post.timestamp.toDate()) : new Date();
                
                const postElement = document.createElement('div');
                postElement.className = 'card mb-3';
                postElement.innerHTML = `
                    <div class="card-body">
                        <div class="d-flex align-items-center mb-2">
                            <img src="${post.userPhoto}" class="rounded-circle me-2" width="40" height="40" alt="Foto de perfil">
                            <div>
                                <h6 class="card-subtitle mb-0">${post.userName}</h6>
                                <small class="text-muted">${postDate.toLocaleString()}</small>
                            </div>
                        </div>
                        <p class="card-text">${post.content}</p>
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <button class="btn btn-outline-primary btn-sm me-2" onclick="window.likePost('${doc.id}')">
                                    <i class="bi bi-heart"></i> 
                                    <span class="like-count">${post.likes || 0}</span>
                                </button>
                                <button class="btn btn-outline-secondary btn-sm" onclick="window.toggleComments('${doc.id}')">
                                    <i class="bi bi-chat"></i> 
                                    <span>${post.comments?.length || 0}</span>
                                </button>
                            </div>
                            ${auth.currentUser.uid === post.userId ? 
                                `<button class="btn btn-outline-danger btn-sm" onclick="window.deletePost('${doc.id}')">
                                    <i class="bi bi-trash"></i>
                                </button>` : ''
                            }
                        </div>
                        <div id="comments-${doc.id}" class="mt-3 d-none">
                            <div class="comments-list mb-2">
                                ${post.comments ? post.comments.map(comment => `
                                    <div class="comment-item mb-2 p-2 bg-light rounded">
                                        <small class="fw-bold">${comment.userName}:</small>
                                        <small>${comment.text}</small>
                                    </div>
                                `).join('') : ''}
                            </div>
                            <div class="input-group">
                                <input type="text" class="form-control form-control-sm" placeholder="Añade un comentario...">
                                <button class="btn btn-outline-primary btn-sm" onclick="window.addComment('${doc.id}', this.previousElementSibling.value)">
                                    Enviar
                                </button>
                            </div>
                        </div>
                    </div>
                `;
                postsContainer.appendChild(postElement);
            });
        }, (error) => {
            console.error("Error cargando posts:", error);
            showMessage('Error al cargar las publicaciones', 'danger');
        });
}

// Funciones globales para los eventos
window.likePost = async (postId) => {
    try {
        const postRef = db.collection('posts').doc(postId);
        await postRef.update({
            likes: firebase.firestore.FieldValue.increment(1)
        });
    } catch (error) {
        showMessage('Error al dar like', 'danger');
    }
};

window.toggleComments = (postId) => {
    const commentsDiv = document.getElementById(`comments-${postId}`);
    commentsDiv.classList.toggle('d-none');
};

window.addComment = async (postId, text) => {
    if (!text.trim()) return;
    
    try {
        const user = auth.currentUser;
        const comment = {
            userId: user.uid,
            userName: user.displayName || user.email.split('@')[0],
            text: text.trim(),
            timestamp: new Date().toISOString()
        };

        await db.collection('posts').doc(postId).update({
            comments: firebase.firestore.FieldValue.arrayUnion(comment)
        });

        // Limpiar el input
        const input = document.querySelector(`#comments-${postId} input`);
        if (input) input.value = '';
    } catch (error) {
        showMessage('Error al añadir el comentario: ' + error.message, 'danger');
    }
};

window.deletePost = async (postId) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta publicación?')) {
        try {
            await db.collection('posts').doc(postId).delete();
            showMessage('Publicación eliminada con éxito', 'success');
        } catch (error) {
            showMessage('Error al eliminar la publicación: ' + error.message, 'danger');
        }
    }
};

// Mostrar mensajes
function showMessage(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3`;
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(alertDiv);
    setTimeout(() => alertDiv.remove(), 3000);
}

// Event Listeners
postForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const content = postInput.value.trim();
    if (content) {
        await createPost(content);
    }
});

/// Cerrar sesión
document.getElementById('logout').addEventListener('click', () => {
    auth.signOut()
        .then(() => window.location.href = "welcome.html")
        .catch((error) => showMessage('Error al cerrar sesión: ' + error.message, 'danger'));
});
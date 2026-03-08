// js/auth.js
(function() {
    // Esperar a que el DOM esté listo
    document.addEventListener('DOMContentLoaded', function() {
        console.log('📝 Auth.js cargado');
        
        // Verificar que Firebase esté disponible
        if (typeof firebase === 'undefined') {
            console.error('❌ Firebase no está disponible');
            alert('Error: Firebase no está disponible. Recarga la página.');
            return;
        }

        // Verificar que auth esté disponible
        if (!window.auth) {
            console.error('❌ Auth no está inicializado');
            alert('Error: Servicio de autenticación no disponible');
            return;
        }

        const loginForm = document.getElementById('loginForm');
        
        if (loginForm) {
            console.log('✅ Formulario de login encontrado');
            
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                console.log('📝 Formulario enviado');
                
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;
                const rol = document.getElementById('rol').value;
                
                // Validaciones básicas
                if (!email || !password || !rol) {
                    alert('Por favor completa todos los campos');
                    return;
                }
                
                try {
                    console.log('📝 Intentando autenticar:', email);
                    
                    // Usar window.auth en lugar de auth directamente
                    const userCredential = await window.auth.signInWithEmailAndPassword(email, password);
                    const user = userCredential.user;
                    
                    console.log('✅ Usuario autenticado:', user.email);
                    
                    // Obtener información del usuario desde Firestore
                    const userDoc = await window.db.collection('usuarios').doc(user.uid).get();
                    
                    if (userDoc.exists) {
                        const userData = userDoc.data();
                        console.log('✅ Datos de usuario:', userData);
                        
                        if (userData.rol === rol) {
                            // Guardar datos en sessionStorage
                            sessionStorage.setItem('user', JSON.stringify({
                                uid: user.uid,
                                email: user.email,
                                nombre: userData.nombre,
                                rol: userData.rol
                            }));
                            
                            // Redirigir según el rol
                            const redirectUrls = {
                                'admin': 'admin.html',
                                'profesor': 'profesor.html',
                                'alumno': 'alumno.html'
                            };
                            
                            window.location.href = redirectUrls[rol] || 'dashboard.html';
                        } else {
                            alert(`El rol seleccionado (${rol}) no coincide con el usuario (${userData.rol})`);
                            await window.auth.signOut();
                        }
                    } else {
                        alert('Usuario no encontrado en la base de datos');
                        await window.auth.signOut();
                    }
                } catch (error) {
                    console.error('❌ Error en login:', error);
                    
                    // Mensajes de error más amigables
                    const errorMessages = {
                        'auth/user-not-found': 'Usuario no encontrado',
                        'auth/wrong-password': 'Contraseña incorrecta',
                        'auth/invalid-email': 'Correo electrónico inválido',
                        'auth/user-disabled': 'Usuario deshabilitado',
                        'auth/too-many-requests': 'Demasiados intentos. Intenta más tarde'
                    };
                    
                    const message = errorMessages[error.code] || 'Error en la autenticación';
                    alert(message + '. Usa las credenciales de demo.');
                }
            });
        } else {
            console.warn('⚠️ No se encontró el formulario de login');
        }
    });

    // Función para cerrar sesión (global)
    window.logout = function() {
        if (window.auth) {
            window.auth.signOut()
                .then(() => {
                    sessionStorage.clear();
                    window.location.href = 'login.html';
                })
                .catch((error) => {
                    console.error('Error al cerrar sesión:', error);
                });
        }
    };

    // Verificar estado de autenticación
    if (window.auth) {
        window.auth.onAuthStateChanged((user) => {
            if (user) {
                console.log('👤 Usuario autenticado:', user.email);
            } else {
                console.log('👤 No hay usuario autenticado');
                // Redirigir si no está en login.html o index.html
                const currentPage = window.location.pathname.split('/').pop();
                if (!['login.html', 'index.html', ''].includes(currentPage)) {
                    window.location.href = 'login.html';
                }
            }
        });
    }
})();
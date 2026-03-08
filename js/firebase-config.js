// js/firebase-config.js
(function() {
    // Configuración de Firebase - REEMPLAZA CON TUS DATOS
    const firebaseConfig = {
        apiKey: "AIzaSyB...", // Tu API Key
        authDomain: "edusmart-school.firebaseapp.com",
        projectId: "edusmart-school",
        storageBucket: "edusmart-school.appspot.com",
        messagingSenderId: "123456789",
        appId: "1:123456789:web:abc123"
    };

    // Inicializar Firebase solo si no está ya inicializado
    if (!firebase.apps.length) {
        try {
            firebase.initializeApp(firebaseConfig);
            console.log('✅ Firebase inicializado correctamente');
        } catch (error) {
            console.error('❌ Error inicializando Firebase:', error);
        }
    }

    // Inicializar servicios
    window.auth = firebase.auth();
    window.db = firebase.firestore();
    window.storage = firebase.storage();

    // Configuración de persistencia
    window.auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
        .then(() => {
            console.log('✅ Persistencia configurada');
        })
        .catch((error) => {
            console.error("Error configurando persistencia:", error);
        });

    console.log('✅ Servicios de Firebase disponibles');
})();
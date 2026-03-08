class AdminPanel {
    constructor() {
        this.init();
    }
    
    async init() {
        await this.loadStats();
        this.setupEventListeners();
    }
    
    async loadStats() {
        try {
            // Cargar estadísticas desde Firestore
            const usuariosCount = await db.collection('usuarios').get().then(snap => snap.size);
            const recursosCount = await db.collection('recursos').get().then(snap => snap.size);
            const cursosCount = await db.collection('cursos').get().then(snap => snap.size);
            
            document.getElementById('totalUsuarios').textContent = usuariosCount;
            document.getElementById('totalRecursos').textContent = recursosCount;
            document.getElementById('totalCursos').textContent = cursosCount;
            
            // Cargar actividades recientes
            await this.loadRecentActivities();
        } catch (error) {
            console.error('Error cargando estadísticas:', error);
        }
    }
    
    async loadRecentActivities() {
        const activitiesList = document.getElementById('recentActivities');
        if (!activitiesList) return;
        
        try {
            const activities = await db.collection('actividades')
                .orderBy('fecha', 'desc')
                .limit(5)
                .get();
                
            activitiesList.innerHTML = '';
            activities.forEach(doc => {
                const activity = doc.data();
                activitiesList.innerHTML += `
                    <li class="list-group-item">
                        <i class="fas fa-circle me-2 text-primary"></i>
                        ${activity.descripcion}
                        <small class="text-muted float-end">${this.formatDate(activity.fecha)}</small>
                    </li>
                `;
            });
        } catch (error) {
            console.error('Error cargando actividades:', error);
        }
    }
    
    formatDate(timestamp) {
        if (!timestamp) return '';
        const date = timestamp.toDate();
        return new Intl.RelativeTimeFormat('es').format(
            Math.ceil((date - new Date()) / (1000 * 60 * 60 * 24)), 
            'day'
        );
    }
    
    setupEventListeners() {
        // Configurar listeners para los botones del panel
        document.querySelectorAll('.btn-action').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.target.dataset.action;
                this.handleAction(action);
            });
        });
    }
    
    handleAction(action) {
        switch(action) {
            case 'nuevo-usuario':
                this.mostrarModalUsuario();
                break;
            case 'nuevo-curso':
                this.mostrarModalCurso();
                break;
            case 'subir-recurso':
                this.mostrarModalRecurso();
                break;
        }
    }
    
    mostrarModalUsuario() {
        // Implementar modal para crear usuario
        alert('Funcionalidad para crear nuevo usuario');
    }
    
    mostrarModalCurso() {
        // Implementar modal para crear curso
        alert('Funcionalidad para crear nuevo curso');
    }
    
    mostrarModalRecurso() {
        // Implementar modal para subir recurso
        alert('Funcionalidad para subir nuevo recurso');
    }
}

// Inicializar panel cuando el documento esté listo
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('adminPanel')) {
        new AdminPanel();
    }
});
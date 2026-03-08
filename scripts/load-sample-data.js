const admin = require('firebase-admin');
const serviceAccount = require('./service-account-key.json');
const sampleData = require('../data/sample-data.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function loadData() {
  try {
    console.log('Cargando datos de ejemplo...');
    
    // Cargar usuarios
    for (const usuario of sampleData.usuarios) {
      await db.collection('usuarios').doc(usuario.id).set(usuario);
      console.log(`Usuario cargado: ${usuario.nombre}`);
    }
    
    // Cargar cursos
    for (const curso of sampleData.cursos) {
      await db.collection('cursos').doc(curso.id).set(curso);
      console.log(`Curso cargado: ${curso.nombre}`);
    }
    
    // Cargar recursos
    for (const recurso of sampleData.recursos) {
      await db.collection('recursos').doc(recurso.id).set(recurso);
      console.log(`Recurso cargado: ${recurso.titulo}`);
    }
    
    // Cargar progreso
    for (const prog of sampleData.progreso) {
      await db.collection('progreso').doc(prog.id).set(prog);
      console.log(`Progreso cargado para: ${prog.estudiante}`);
    }
    
    console.log('✅ Datos cargados exitosamente');
  } catch (error) {
    console.error('❌ Error cargando datos:', error);
  }
}

loadData();
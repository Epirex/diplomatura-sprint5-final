import fetch from 'node-fetch';
import mongoose from 'mongoose';
import { connectDB } from '../config/dbConfig.mjs';

const COLLECTION_NAME = 'Grupo-11';
const CREATOR = 'Esteban'; 
const API_URL = 'https://restcountries.com/v3.1/all';

const CAMPOS_ELIMINAR = [
  'translations', 'tld', 'cca2', 'ccn3', 'cca3', 'cioc', 'idd',
  'altSpellings', 'car', 'coatOfArms', 'postalCode', 'demonyms'
];

async function agregarPaises() {
  try {
    console.log('Conectando a la base de datos...');
    await connectDB();
    const db = mongoose.connection;
    const collection = db.collection(COLLECTION_NAME);

    console.log('🌍 Obteniendo datos de países...');
    const response = await fetch(API_URL);
    const paises = await response.json();

    console.log(`📊 Procesando ${paises.length} países...`);
    const paisesFiltrados = paises
      .filter(p => p.languages && Object.keys(p.languages).includes('spa'))
      .map(p => {
        // Eliminar campos no deseados
        CAMPOS_ELIMINAR.forEach(campo => delete p[campo]);
        // Agregar campo "creador"
        p.creador = CREATOR;
        return p;
      });

    await collection.insertMany(paisesFiltrados);
    console.log(`✅ Se insertaron ${paisesFiltrados.length} países en la colección "${COLLECTION_NAME}".`);

    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error al insertar países:', error);
  }
}

agregarPaises();

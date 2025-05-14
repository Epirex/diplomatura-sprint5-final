import express from 'express';
import {
  obtenerPaisPorIdController,
  obtenerTodosLosPaisesController,
  buscarPaisesPorAtributoController,
  obtenerPaisesMayoresDe30Controller,
  crearPaisController,
  actualizarPaisController,
  eliminarPaisPorIdController,
  eliminarPaisPorNombreController,
  agregarPaisController,
  mostrarFormularioEditarPais,
  editarPaisController,
  eliminarPaisYRedirigirController
} from '../controllers/PaisesController.mjs';

import { renderizarListaPaises } from '../views/responseView.mjs';
import { buscarPaisesPorAtributo } from '../services/PaisesService.mjs';

const router = express.Router();

// API REST
router.get('/api/buscar/:atributo/:valor', buscarPaisesPorAtributoController);
router.get('/api/mayores-de-30', obtenerPaisesMayoresDe30Controller);
router.get('/api/:id', obtenerPaisPorIdController);
router.post('/api', crearPaisController);
router.put('/api/:id', actualizarPaisController);
router.delete('/api/:id', eliminarPaisPorIdController);
router.delete('/api/nombre/:nombre', eliminarPaisPorNombreController);

// VISTAS / FORMULARIOS
router.get('/', async (req, res) => {
  try {
    const rawPaises = await buscarPaisesPorAtributo('creador', 'Esteban');
    const paises = renderizarListaPaises(rawPaises);
    const mensaje = req.query.mensaje;

    const poblacionTotal = rawPaises.reduce((sum, p) => sum + (p.population || 0), 0);
    const areaTotal = rawPaises.reduce((sum, p) => sum + (p.area || 0), 0);
    const giniTotal = rawPaises.reduce((sum, p) => {
      const giniValor = p.gini && typeof p.gini === 'object' ? Object.values(p.gini)[0] : null;
      return sum + (giniValor || 0);
    }, 0);
    const giniPromedio = rawPaises.length ? (giniTotal / rawPaises.length).toFixed(2) : 0;

    res.render('dashboard', {
      title: 'Dashboard de Países',
      mensaje,
      paises,
      totales: { poblacionTotal, areaTotal, giniPromedio }
    });
  } catch (error) {
    console.error('Error en /paises:', error);
    res.status(500).render('dashboard', {
      title: 'Error en Dashboard',
      mensaje: null,
      paises: [],
      error: 'Error al obtener los países',
      totales: { poblacionTotal: 0, areaTotal: 0, giniPromedio: 0 }
    });
  }
});

// Agregar país
router.get('/formulario/agregar', (req, res) => {
  res.render('addPais', {
    title: 'Agregar País',
    datos: {},
    errores: []
  });
});
router.post('/agregar', agregarPaisController);

// Editar país
router.get('/formulario/editar/:id', mostrarFormularioEditarPais);
router.post('/formulario/editar/:id', editarPaisController);

// Eliminar país desde dashboard (formulario con method-override)
router.delete('/:id', eliminarPaisYRedirigirController);

// Página de contacto
router.get('/contacto', (req, res) => {
  res.render('contacto', { title: 'Contacto' });
});
router.post('/contacto', (req, res) => {
  const { nombre, email, mensaje } = req.body;
  console.log('Mensaje recibido:', { nombre, email, mensaje });
  res.status(200).json({ success: true });
});

export default router;


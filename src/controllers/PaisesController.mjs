import {
  obtenerPaisPorId,
  obtenerTodosLosPaises,
  buscarPaisesPorAtributo,
  obtenerPaisesMayoresDe30,
  crearPais,
  actualizarPais,
  eliminarPaisPorId,
  eliminarPaisPorNombre
} from '../services/PaisesService.mjs';

import validarPais from '../utils/validaciones.mjs';

// =========================
// API - JSON
// =========================

export async function obtenerPaisPorIdController(req, res) {
  try {
    const pais = await obtenerPaisPorId(req.params.id);
    if (!pais) return res.status(404).json({ error: 'País no encontrado' });
    res.json(pais);
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar el país' });
  }
}

export async function buscarPaisesPorAtributoController(req, res) {
  const { atributo, valor } = req.params;
  try {
    const resultados = await buscarPaisesPorAtributo(atributo, valor);
    res.json(resultados);
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar países' });
  }
}

export async function obtenerPaisesMayoresDe30Controller(req, res) {
  try {
    const paises = await obtenerPaisesMayoresDe30();
    res.json(paises);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener países con población mayor a 30 millones' });
  }
}

export async function crearPaisController(req, res) {
  const datos = req.body;
  const resultadoValidacion = validarPais(datos);

  if (!resultadoValidacion.ok) {
    return res.status(400).json({ errores: resultadoValidacion.errors });
  }

  const datosValidados = resultadoValidacion.data;

  const nuevoPais = {
    name: {
      official: datosValidados.nombreEspanol,
      nativeName: {
        spa: {
          official: datosValidados.nombreEspanol
        }
      }
    },
    capital: datosValidados.capital,
    borders: datosValidados.fronteras,
    area: datosValidados.area,
    population: datosValidados.poblacion,
    gini: (datosValidados.gini !== null && datosValidados.giniAnio)
  ? { [datosValidados.giniAnio]: datosValidados.gini }
  : undefined,
    timezones: datosValidados.zonasHorarias,
    creador: datosValidados.creador
  };

  try {
    const pais = await crearPais(nuevoPais);
    res.status(201).json(pais);
  } catch (error) {
    console.error("Error al crear el país:", error);
    res.status(500).json({ error: 'Error al crear el país' });
  }
}

export async function actualizarPaisController(req, res) {
  const { id } = req.params;
  const datos = req.body;
  const resultadoValidacion = validarPais(datos);

  if (!resultadoValidacion.ok) {
    return res.status(400).json({ errores: resultadoValidacion.errors });
  }

  const datosValidados = resultadoValidacion.data;

  const paisActualizado = {
    name: {
      official: datosValidados.nombreEspanol,
      nativeName: {
        spa: {
          official: datosValidados.nombreEspanol
        }
      }
    },
    capital: datosValidados.capital,
    borders: datosValidados.fronteras,
    area: datosValidados.area,
    population: datosValidados.poblacion,
    gini: (datosValidados.gini !== null && datosValidados.giniAnio)
  ? { [datosValidados.giniAnio]: datosValidados.gini }
  : undefined,
    timezones: datosValidados.zonasHorarias,
    creador: datosValidados.creador
  };

  try {
    const actualizado = await actualizarPais(id, paisActualizado);
    if (!actualizado) {
      return res.status(404).json({ error: 'País no encontrado' });
    }
    res.json(actualizado);
  } catch (error) {
    console.error("Error al actualizar país:", error);
    res.status(500).json({ error: 'Error al actualizar el país' });
  }
}

export async function eliminarPaisPorIdController(req, res) {
  try {
    await eliminarPaisPorId(req.params.id);
    res.json({ mensaje: 'País eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el país' });
  }
}

export async function eliminarPaisPorNombreController(req, res) {
  try {
    const paisEliminado = await eliminarPaisPorNombre(req.params.nombre);
    if (!paisEliminado) return res.status(404).json({ error: 'País no encontrado' });
    res.json({ mensaje: 'País eliminado por nombre' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar por nombre' });
  }
}

// =========================
// VISTAS / FORMULARIOS
// =========================

export async function obtenerTodosLosPaisesController(req, res) {
  try {
    const paises = await obtenerTodosLosPaises();

    const paisesProcesados = paises.map(pais => ({
      ...pais._doc,
      nombreEspanol: pais.name?.nativeName?.spa?.official || 'Sin nombre'
    }));

    const poblacionTotal = paises.reduce((sum, p) => sum + (p.population || 0), 0);
    const areaTotal = paises.reduce((sum, p) => sum + (p.area || 0), 0);
    const giniTotal = paises.reduce((sum, p) => {
      if (p.gini && typeof p.gini === 'object') {
        const valor = Object.values(p.gini)[0];
        return sum + (valor || 0);
      }
      return sum;
    }, 0);
    const giniPromedio = paises.length ? (giniTotal / paises.length).toFixed(2) : 0;

    res.render('dashboard', {
      title: 'Listado de Países',
      paises: paisesProcesados,
      totales: { poblacionTotal, areaTotal, giniPromedio }
    });
  } catch (error) {
    res.status(500).render('error', {
      title: 'Error',
      mensaje: 'No se pudieron obtener los países'
    });
  }
}

export async function agregarPaisController(req, res) {
  const datos = req.body;
  const resultadoValidacion = validarPais(datos);

  if (!resultadoValidacion.ok) {
    return res.status(400).render('addPais', {
      title: 'Agregar País',
      datos,
      errores: resultadoValidacion.errors,
    });
  }

  const datosValidados = resultadoValidacion.data;

  try {
    const nuevoPais = {
      name: {
        official: datosValidados.nombreEspanol,
        nativeName: {
          spa: {
            official: datosValidados.nombreEspanol
          }
        }
      },
      capital: datosValidados.capital,
      borders: datosValidados.fronteras,
      area: datosValidados.area,
      population: datosValidados.poblacion,
      gini: (datosValidados.gini !== null && datosValidados.giniAnio)
  ? { [datosValidados.giniAnio]: datosValidados.gini }
  : undefined,
      timezones: datosValidados.zonasHorarias,
      creador: datosValidados.creador
    };
    console.log('[Controlador] Recibe datos para crear un pais...');
    await crearPais(nuevoPais);
    res.redirect('/paises?mensaje=País agregado con éxito');
  } catch (error) {
    console.error("Error al agregar país:", error);
    res.status(500).render('addPais', {
      title: 'Agregar País',
      datos,
      errores: ['Error interno al guardar el país']
    });
  }
}


export async function editarPaisController(req, res) {
  const { id } = req.params;
  const datos = req.body;
  const resultadoValidacion = validarPais(datos);

  if (!resultadoValidacion.ok) {
    const datosFormateados = {
      ...datos,
      _id: id,
      capital: Array.isArray(datos.capital) ? datos.capital : datos.capital ? [datos.capital] : [],
      borders: Array.isArray(datos.borders) ? datos.borders : datos.borders ? [datos.borders] : [],
      zonasHorarias: Array.isArray(datos.zonasHorarias)
        ? datos.zonasHorarias
        : datos.zonasHorarias ? [datos.zonasHorarias] : []
    };

    return res.status(400).render('editPais', {
      title: 'Editar País',
      datos: datosFormateados,
      errores: Object.values(resultadoValidacion.errors)
    });
  }

  const datosValidados = resultadoValidacion.data;

  const paisActualizado = {
    name: {
      official: datosValidados.nombreEspanol,
      nativeName: {
        spa: {
          official: datosValidados.nombreEspanol
        }
      }
    },
    capital: datosValidados.capital,
    borders: datosValidados.fronteras,
    area: datosValidados.area,
    population: datosValidados.poblacion,
    gini: (datosValidados.gini !== null && datosValidados.giniAnio)
      ? { [datosValidados.giniAnio]: datosValidados.gini }
      : undefined,
    timezones: datosValidados.zonasHorarias,
    creador: datosValidados.creador
  };

  try {
    const paisOriginal = await obtenerPaisPorId(id);

    if (!paisOriginal) {
      return res.status(404).render('error', {
        title: 'Error',
        mensaje: 'País no encontrado'
      });
    }

    // Normalizar original para comparar
    const paisNormalizado = {
      name: {
        official: paisOriginal.name?.nativeName?.spa?.official,
        nativeName: {
          spa: {
            official: paisOriginal.name?.nativeName?.spa?.official
          }
        }
      },
      capital: paisOriginal.capital,
      borders: paisOriginal.borders,
      area: paisOriginal.area,
      population: paisOriginal.population,
      gini: paisOriginal.gini,
      timezones: paisOriginal.timezones,
      creador: paisOriginal.creador
    };

    // Comparar objetos
    const sinCambios = JSON.stringify(paisNormalizado) === JSON.stringify(paisActualizado);

    if (sinCambios) {
      const datosFormateados = {
        ...datos,
        _id: id,
        capital: Array.isArray(datos.capital) ? datos.capital : datos.capital ? [datos.capital] : [],
        borders: Array.isArray(datos.borders) ? datos.borders : datos.borders ? [datos.borders] : [],
        zonasHorarias: Array.isArray(datos.zonasHorarias)
          ? datos.zonasHorarias
          : datos.zonasHorarias ? [datos.zonasHorarias] : []
      };

      return res.status(400).render('editPais', {
        title: 'Editar País',
        datos: datosFormateados,
        errores: ['No se realizaron cambios. Modificá algún campo para guardar.']
      });
    }

    await actualizarPais(id, paisActualizado);
    res.redirect('/paises?mensaje=País editado con éxito');

  } catch (error) {
    console.error("Error al editar país:", error);

    const datosFormateados = {
      ...datos,
      _id: id,
      capital: Array.isArray(datos.capital) ? datos.capital : datos.capital ? [datos.capital] : [],
      borders: Array.isArray(datos.borders) ? datos.borders : datos.borders ? [datos.borders] : [],
      zonasHorarias: Array.isArray(datos.zonasHorarias)
        ? datos.zonasHorarias
        : datos.zonasHorarias ? [datos.zonasHorarias] : []
    };

    res.status(500).render('editPais', {
      title: 'Editar País',
      datos: datosFormateados,
      errores: ['Error al guardar los cambios']
    });
  }
}


export async function mostrarFormularioEditarPais(req, res) {
  const { id } = req.params;
  try {
    const pais = await obtenerPaisPorId(id);
    if (!pais) {
      return res.status(404).render('error', {
        title: 'Error',
        mensaje: 'País no encontrado'
      });
    }

    const datos = {
      _id: pais._id,
      nombreEspanol: pais.name?.nativeName?.spa?.official || '',
      capital: Array.isArray(pais.capital) ? pais.capital : [pais.capital || ''],
      borders: Array.isArray(pais.borders) ? pais.borders : [pais.borders || ''],
      zonasHorarias: Array.isArray(pais.timezones) ? pais.timezones : [''], // aquí corregido
      area: pais.area || '',
      population: pais.population || '',
      gini: pais.gini ? Object.values(pais.gini)[0] : '',
      giniAnio: pais.gini ? Object.keys(pais.gini)[0] : '',
      creador: pais.creador || ''
    };

    res.render('editPais', {
      title: 'Editar País',
      datos,
      errores: []
    });
  } catch (error) {
    console.error('Error al mostrar el formulario de edición:', error);
    res.status(500).render('error', {
      title: 'Error',
      mensaje: 'No se pudo cargar el formulario de edición'
    });
  }
}



export async function eliminarPaisYRedirigirController(req, res) {
  try {
    await eliminarPaisPorId(req.params.id);
    res.redirect('/paises?mensaje=País eliminado con éxito');
  } catch (error) {
    res.status(500).render('error', {
      title: 'Error al eliminar',
      mensaje: 'No se pudo eliminar el país'
    });
  }
}




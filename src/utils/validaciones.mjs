export default function validarPais(data) {
  const errors = {};

  const {
    nombreEspanol,
    capital,
    fronteras,  
    area,
    poblacion,  
    gini,
    giniAnio,   
    zonasHorarias,
    creador
  } = data;

  // Normalizaciones
  const fronterasNorm = Array.isArray(fronteras)
    ? fronteras.map(s => s.trim()).filter(Boolean)
    : typeof fronteras === 'string'
      ? fronteras.split(',').map(s => s.trim()).filter(Boolean)
      : [];

  const timezones = Array.isArray(zonasHorarias)
    ? zonasHorarias.map(s => s.trim()).filter(Boolean)
    : typeof zonasHorarias === 'string'
      ? zonasHorarias.split(',').map(s => s.trim()).filter(Boolean)
      : [];

  const capitals = Array.isArray(capital)
    ? capital.map(c => c.trim()).filter(Boolean)
    : typeof capital === 'string'
      ? capital.split(',').map(c => c.trim()).filter(Boolean)
      : [];

  const areaNum = parseFloat(area);
  const poblacionNum = parseInt(poblacion);
  const giniNum = gini ? parseFloat(gini) : null;
  const giniAnioNum = giniAnio ? parseInt(giniAnio) : null;

  // Validaciones
  if (!nombreEspanol || nombreEspanol.trim().length < 3 || nombreEspanol.trim().length > 90) {
    errors.nombreEspanol = 'El nombre en español debe tener entre 3 y 90 caracteres.';
  }

  if (!capitals.length || capitals.some(c => c.length < 3 || c.length > 90)) {
    errors.capital = 'Cada capital debe tener entre 3 y 90 caracteres.';
  }

  if (fronterasNorm.some(c => !/^[A-Z]{3}$/.test(c))) {
    errors.fronteras = 'Cada frontera debe ser un código de 3 letras mayúsculas.';
  }

  if (!(areaNum > 0)) {
    errors.area = 'El área debe ser un número positivo.';
  }

  if (!(poblacionNum > 0)) {
    errors.poblacion = 'La población debe ser un número entero positivo.';
  }

  if (giniNum !== null) {
    if (giniNum < 0 || giniNum > 100) {
      errors.gini = 'El índice Gini debe estar entre 0 y 100.';
    }
    if (!giniAnioNum) {
      errors.giniAnio = 'Debes proporcionar el año del índice Gini.';
    } else if (giniAnioNum < 1900 || giniAnioNum > new Date().getFullYear()) {
      errors.giniAnio = 'El año del Gini debe estar entre 1900 y el año actual.';
    }
  } else if (giniAnioNum) {
    errors.gini = 'Si ingresas un año para el Gini, también debes proporcionar su valor.';
  }

  if (!creador || typeof creador !== 'string' || creador.trim().length === 0) {
    errors.creador = 'Debe ingresar un nombre de creador.';
  }

  return Object.keys(errors).length > 0
    ? { ok: false, errors }
    : {
        ok: true,
        data: {
          nombreEspanol: nombreEspanol.trim(),
          capital: capitals,
          fronteras: fronterasNorm,
          area: areaNum,
          poblacion: poblacionNum,
          gini: giniNum,
          giniAnio: giniAnioNum, // <-- Ahora se devuelve el año del Gini
          zonasHorarias: timezones,
          creador: creador.trim()
        }
      };
}

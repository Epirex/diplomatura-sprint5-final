// renderizar un solo país
export function renderizarPais(pais) {
  const data = pais._doc || pais;
  return {
    _id: data._id.toString(),
    nombreEspanol: data.name?.nativeName?.spa?.official || "Sin nombre",
    capital: Array.isArray(data.capital) ? data.capital.join(', ') : data.capital || "Desconocida",
    fronteras: Array.isArray(data.borders) && data.borders.length ? data.borders.join(', ') : "N/A",
    area: data.area || 0,
    poblacion: data.population || 0,
    gini: data.gini ? `${Object.values(data.gini)[0]} (${Object.keys(data.gini)[0]})` : 'N/A',
    zonasHorarias: Array.isArray(data.timezones) ? data.timezones.join(', ') : "N/A",
    creador: data.creador || "No especificado"
  };
}


// renderizar lista de países
export function renderizarListaPaises(paises) {
  return paises.map(pais => ({
    _id: pais._id.toString(),
    ...renderizarPais(pais)
  }));
}


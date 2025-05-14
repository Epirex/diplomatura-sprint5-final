import PaisRepository from '../repositories/PaisRepository.mjs';

export async function obtenerPaisPorId(id) {
  return await PaisRepository.obtenerPorId(id);
}

export async function obtenerTodosLosPaises() {
  const paises = await PaisRepository.buscarPorAtributo('creador', 'Esteban');
  console.log("Paises encontrados:", paises.length);
  return Array.isArray(paises) ? paises : [];
}

export async function buscarPaisesPorAtributo(atributo, valor) {
  return await PaisRepository.buscarPorAtributo(atributo, valor);
}

export async function obtenerPaisesMayoresDe30() {
  return await PaisRepository.obtenerMayoresDe30();
}

export async function crearPais(datos) {
  console.log('[Servicio] Crea el pais...');
  return await PaisRepository.crear(datos);
}

export async function actualizarPais(id, datos) {
  return await PaisRepository.actualizar(id, datos);
}

export async function eliminarPaisPorId(id) {
  return await PaisRepository.eliminarPorId(id);
}

export async function eliminarPaisPorNombre(nombre) {
  return await PaisRepository.eliminarPorNombre(nombre);
}


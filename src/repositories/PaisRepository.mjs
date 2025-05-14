import Pais from '../models/Pais.mjs';
import IRepository from './IRepository.mjs';

class PaisRepository extends IRepository {

  async obtenerPorId(id) {
    return await Pais.findById(id);
  }

  async obtenerTodos() {
    return await Pais.find({ "name.nativeName.spa.official": { $exists: true, $ne: "" } });
  }

  async buscarPorAtributo(atributo, valor) {
    return await Pais.find({ [atributo]: valor });
  }

  // Se usa como ejemplo para países con población mayor a 30 millones
  async obtenerMayoresDe30() {
    return await Pais.find({ population: { $gt: 30000000 } });
  }

  async crear(datos) {
    console.log('[Repositorio] Guardando en base de datos...');
    const nuevoPais = new Pais(datos);
    console.log('[Repositorio] Pais guardado en la base de datos:', nuevoPais);
    return await nuevoPais.save();
  }

  async actualizar(id, datos) {
    return await Pais.findByIdAndUpdate(id, datos, { new: true });
  }

  async eliminarPorId(id) {
    return await Pais.findByIdAndDelete(id);
  }

  async eliminarPorNombre(nombre) {
    return await Pais.findOneAndDelete({ "name.nativeName.spa.official": nombre });
  }
}

export default new PaisRepository();


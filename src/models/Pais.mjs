
import mongoose from 'mongoose';

const paisSchema = new mongoose.Schema({
  name: {
    official: String,
    nativeName: {
      spa: {
        official: String
      }
    }
  },
  capital: [String],
  borders: [String],
  area: Number,
  population: Number,
  gini: mongoose.Schema.Types.Mixed,
  timezones: [String],
  creador: String
});

export default mongoose.model('Pais', paisSchema, 'Grupo-11');



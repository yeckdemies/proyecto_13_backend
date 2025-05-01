const mongoose = require('mongoose');

const conductorSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String },
  telefono: { type: String },
  dni: {
    type: String,
    required: true
  },
  fechaNacimiento: { type: Date },
  direccion: String,
  ciudad: String,
  provincia: String,
  codigoPostal: String
}, {
  collection: 'conductores',
  timestamps: true
});

module.exports = mongoose.model('Conductor', conductorSchema);

const mongoose = require('mongoose');

const conductorSchema = new mongoose.Schema({
  dni: {
    type: String,
    required: true
  },
  nombre: { type: String, required: true },
  fechaNacimiento: { type: Date },
  telefono: { type: String },
  email: { type: String, required: true},
  direccion: { type: String, required: true},
  ciudad: { type: String, required: true},
  provincia: { type: String, required: true},
  codigoPostal: String
}, {
  collection: 'conductores',
  timestamps: true
});

module.exports = mongoose.model('conductores', conductorSchema, "conductores");

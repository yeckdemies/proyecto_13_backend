const mongoose = require('mongoose');

const proveedorSchema = new mongoose.Schema({
  nif: {
    type: String,
    required: true
  },
  nombre: {
    type: String,
    required: true
  },
  razonSocial: {
    type: String,
    required: true
  },
  telefono: String,
  email: {
    type: String,
    required: true
  },
  paginaWeb: {
    type: String,
    required: true
  },
  ciudad: {
    type: String,
    required: true
  },
  codigoPostal: String,
  direccion: {
    type: String,
    required: true
  },
  provincia: {
    type: String,
    required: true
  },
  tipo: {
    type: String,
    enum: ['Renting', 'Tarjeta Combustible', 'Taller'],
    required: true
  }
}, {
  collection: 'proveedores',
  timestamps: true
});

module.exports = mongoose.model('proveedores', proveedorSchema, 'proveedores');
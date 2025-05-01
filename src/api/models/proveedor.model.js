const mongoose = require('mongoose');

const proveedorSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  tipo: {
    type: String,
    enum: ['Renting', 'Tarjeta Combustible', 'Taller'],
    required: true
  },
  proveedor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Proveedor'
  },
  direccion: String,
  ciudad: String,
  provincia: String,
  codigoPostal: String,
  paginaWeb: String,
  email: String,
  telefono: String,
  razonSocial: String,
  nif: String
}, {
  collection: 'proveedores',
  timestamps: true,toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

proveedorSchema.virtual('vehiculos', {
  ref: 'Vehiculo',
  localField: '_id',
  foreignField: 'proveedor'
});

module.exports = mongoose.model('Proveedor', proveedorSchema);

const mongoose = require('mongoose');

const mantenimientoSchema = new mongoose.Schema({
  vehiculo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehiculo',
    required: true
  },
  taller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Proveedor',
    required: true
  },
  fechaEntrada: {
    type: Date,
    required: true
  },
  fechaSalida: {
    type: Date
  },
  tipoMantenimiento: {
    type: String,
    enum: ['ITV', 'Mantenimiento programado', 'Reparación', 'Lavado'],
    required: true
  },
  kilometraje: Number,
  paqueteMantenimiento: String,
  causaMantenimiento: String,
  costoTotal: Number,
  fechaPago: Date,
  metodoPago: {
    type: String,
    enum: ['contado', 'tarjeta', 'transferencia']
  },
  observaciones: String
}, {
  collection: 'mantenimientos',
  timestamps: true
});

module.exports = mongoose.model('Mantenimiento', mantenimientoSchema);
const mongoose = require('mongoose');

const metodoPagoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  identificador: {
    type: String,
    unique: true,
    required: true
  },
  tipo: {
    type: String,
    enum: ['Tarjeta Combustible', 'Tarjeta Crédito', 'Tarjeta Débito', 'Telemat', 'Telepeaje'],
    required: true
  },
  proveedor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Proveedor'
  },
  estado: {
    type: String,
    enum: ['Activo', 'Inactivo', 'Baja', 'Bloqueado', 'Cancelado'],
    default: 'Activo'
  },
  comentarios: String
}, {
  collection: 'metodos_pago',
  timestamps: true
});

module.exports = mongoose.model('MetodoPago', metodoPagoSchema);

const mongoose = require('mongoose');

const reservaSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  vehiculo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'vehiculos',
    required: true
  },
  conductor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'conductores',
    required: true
  },
  fechaInicio: {
    type: Date,
    required: true
  },
  fechaFin: {
    type: Date,
    required: true
  },
  estado: {
    type: String,
    enum: ['Activa', 'Cancelada', 'Finalizada'],
    default: 'Activa'
  },
  motivoCancelacion: {
    type: String,
    default: ''
  }
}, {
  timestamps: true,
  collection: 'reservas'
});

module.exports = mongoose.model('reservas', reservaSchema, 'reservas');

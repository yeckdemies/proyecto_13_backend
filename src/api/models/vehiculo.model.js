const mongoose = require('mongoose');

const vehiculoSchema = new mongoose.Schema({
  tipoVehiculo: {
    type: String,
    enum: ['Turismo', 'SUV', 'Furgoneta'],
    required: true
  },
  matricula: {
    type: String,
    unique: true,
    required: true
  },
  bastidor: String,
  propiedad: {
    type: String,
    enum: ['Renting', 'Propio'],
    required: true
  },
  estado: {
    type: String,
    enum: ['Activo', 'Inactivo', 'Taller'],
    default: 'Activo',
    required: true
  },
  tipoCombustible: {
    type: String,
    enum: ['Diesel', 'Gasolina', 'Diesel + ADV', 'Eléctrico', 'Gas'],
    required: true
  },
  permisoCirculacionUrl: String,
  ciudad: {
    type: String,
    required: true
  },
  marca: {
    type: String,
    required: true
  },
  modelo: {
    type: String,
    required: true
  },
  anio: {
    type: Number,
    required: true
  },
  color: String,
  fechaVigorItv: {
    type: Date,
    required: true
  },
  costeAlquilerMensual: Number,
  fechaInicioContratoRenting: Date,
  fechaFinContratoRenting: Date,
  proveedor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Proveedor'
  },
  conductor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conductor'
  }
}, {
  collection: 'vehiculos',
  timestamps: true
});

module.exports = mongoose.model('Vehiculo', vehiculoSchema);

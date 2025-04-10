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
  pais: {
    type: String,
    enum: ['España', 'Alemania', 'Italia', 'Francia', 'Marruecos', 'Mexico', 'EEUU'],
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
  empresaTitular: String,
  proveedor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Proveedor'
  },
  conductor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conductor'
  },
  tipoRenting: {
    type: String,
    enum: ['Fijo', 'Variable']
  },
  telemetria: {
    type: Boolean,
    default: false
  }
}, {
  collection: 'vehiculos',
  timestamps: true
});

module.exports = mongoose.model('Vehiculo', vehiculoSchema);

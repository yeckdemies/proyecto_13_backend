const mongoose = require('mongoose');

const vehiculoSchema = new mongoose.Schema({
  tipoVehiculo: {
    type: String,
    enum: ['turismo', 'suv', 'furgoneta'],
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
    enum: ['renting', 'propio'],
    required: true
  },
  estado: {
    type: String,
    enum: ['activo', 'inactivo', 'taller'],
    default: 'Activo'
  },
  tipoCombustible: {
    type: String,
    enum: ['diesel', 'gasolina', 'diesel + adv', 'eléctrico', 'gas'],
    required: true
  },
  permisoCirculacionUrl: String,
  ciudad: String,
  pais: {
    type: String,
    enum: ['España', 'Alemania', 'Italia', 'Francia', 'Marruecos', 'Mexico', 'EEUU'],
    required: true
  },
  marca: String,
  modelo: String,
  año: Number,
  color: String,
  fechaVigorItv: Date,
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
    ref: 'Conductor',
    unique: true
  },
  tipoRenting: {
    type: String,
    enum: ['fijo', 'variable']
  },
  telemetria: {
    type: Boolean,
    default: false
  },
  coordenadas: {
    lat: Number,
    lng: Number
  }
}, {
  collection: 'vehiculos',
  timestamps: true
});

module.exports = mongoose.model('Vehiculo', vehiculoSchema);

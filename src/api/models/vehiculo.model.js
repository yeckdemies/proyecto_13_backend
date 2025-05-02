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
    ref: 'proveedores'
  },
  conductor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'conductores'
  }
}, {
  collection: 'vehiculos',
  timestamps: true
});

module.exports = mongoose.model('vehiculos', vehiculoSchema, 'vehiculos');

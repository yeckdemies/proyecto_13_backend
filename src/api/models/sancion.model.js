const mongoose = require('mongoose');

const sancionSchema = new mongoose.Schema({
  numeroExpediente: {
    type: String,
    required: true,
    unique: true
  },
  fechaHoraSancion: {
    type: Date,
    required: true
  },
  fechaComunicacion: {
    type: Date
  },
  ente: {
    type: String // autoridad sancionadora
  },
  numeroNotificaciones: {
    type: Number,
    default: 0
  },
  vehiculo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehiculo',
    required: true
  },
  conductor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conductor'
  },
  infraccion: {
    type: String,
    required: true
  },
  importe: {
    type: Number
  },
  gestionada: {
    type: Boolean,
    default: false
  },
  empresa: {
    type: String
  },
  completada: {
    type: Boolean,
    default: false
  },
  perdidaPuntos: {
    type: Boolean,
    default: false
  },
  comentarios: String
}, {
  collection: 'sanciones',
  timestamps: true
});

module.exports = mongoose.model('Sancion', sancionSchema);

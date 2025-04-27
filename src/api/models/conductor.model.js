const mongoose = require('mongoose');

const conductorSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  correoElectronicoPersonal: { type: String },
  correoElectronicoEmpresa: { type: String },
  estado: {
    type: String,
    enum: ['activo', 'inactivo', 'baja'],
    default: 'activo'
  },
  telefono: { type: String },
  tiposCarne: {
    type: [String],
    enum: ['AM', 'A1', 'A2', 'A', 'B1', 'B', 'C1', 'C', 'D1', 'D', 'BE', 'C1E', 'CE', 'D1E', 'DE'],
    default: []
  },
  metodoPago: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MetodoPago'
  },
  numeroPermisoConducir: { type: String },
  permisoPermanente: { type: Boolean, default: false },
  fechaExpiracionPermiso: { type: Date },
  dni: {
    type: String,
    required: true,
    unique: true,
    match: /^[0-9]{8}[A-Z]$/
  },
  fechaNacimiento: { type: Date },
  fechaIngreso: { type: Date },
  fechaBaja: { type: Date },
  direccion: String,
  ciudad: String,
  provincia: String,
  codigoPostal: String,
  codigoEmpleado: String,
  empresa: String,
  telefonoPersonal: String,
  telefonoEmpresa: String,

  comentarios: String
}, {
  collection: 'conductores',
  timestamps: true
});

module.exports = mongoose.model('Conductor', conductorSchema);

const mongoose = require('mongoose');
const Reserva = require('../api/models/reserva.model');

const validarFechas = (fechaInicio, fechaFin) => {
  const hoy = new Date();
  if (!fechaInicio || !fechaFin) return 'Debes seleccionar ambas fechas.';
  if (new Date(fechaInicio) < hoy) return 'La fecha de inicio no puede ser anterior a hoy.';
  if (new Date(fechaInicio) >= new Date(fechaFin)) return 'La fecha de fin debe ser posterior a la de inicio.';
  return null;
};

const comprobarSolapamientos = async ({ id = null, vehiculo, conductor, fechaInicio, fechaFin }) => {
  const filtroFechas = {
    $or: [
      { fechaInicio: { $lte: fechaFin }, fechaFin: { $gte: fechaInicio } }
    ],
    estado: 'Activa'
  };

  if (id && mongoose.Types.ObjectId.isValid(id)) {
    filtroFechas._id = { $ne: id };
  }

  const [conflictoVehiculo, conflictoConductor] = await Promise.all([
    Reserva.exists({ ...filtroFechas, vehiculo }),
    Reserva.exists({ ...filtroFechas, conductor })
  ]);

  return {
    vehiculoDisponible: !conflictoVehiculo,
    conductorDisponible: !conflictoConductor
  };
};

module.exports = {
  validarFechas,
  comprobarSolapamientos
};
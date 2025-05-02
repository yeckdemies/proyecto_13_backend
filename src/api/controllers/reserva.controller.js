const Reserva = require('../models/reserva.model');
const Vehiculo = require('../models/vehiculo.model');
const Conductor = require('../models/conductor.model');
const mongoose = require('mongoose');

const crearReserva = async (req, res) => {
  try {
    const { vehiculo, conductor, fechaInicio, fechaFin } = req.body;
    const usuario = req.user._id;

    if (new Date(fechaInicio) >= new Date(fechaFin)) {
      return res.status(400).json({ message: 'Las fechas no son válidas' });
    }

    const reservasVehiculo = await Reserva.find({
      vehiculo,
      estado: { $in: ['Activa'] },
      $or: [
        { fechaInicio: { $lte: fechaFin }, fechaFin: { $gte: fechaInicio } }
      ]
    });

    if (reservasVehiculo.length > 0) {
      return res.status(400).json({ message: 'El vehículo no está disponible en ese rango de fechas' });
    }

    const reservasConductor = await Reserva.find({
      conductor,
      estado: { $in: ['Activa'] },
      $or: [
        { fechaInicio: { $lte: fechaFin }, fechaFin: { $gte: fechaInicio } }
      ]
    });

    if (reservasConductor.length > 0) {
      return res.status(400).json({ message: 'El conductor ya tiene una reserva activa en esas fechas' });
    }

    const nuevaReserva = new Reserva({
      usuario,
      vehiculo,
      conductor,
      fechaInicio,
      fechaFin
    });

    await nuevaReserva.save();
    return res.status(201).json(nuevaReserva);
  } catch (error) {
    return res.status(500).json({ message: 'Error al crear reserva', error: error.message });
  }
};

const getReservas = async (req, res) => {
  try {
    const reservas = await Reserva.find()
      .populate('usuario', 'userName email')
      .populate('vehiculo')
      .populate('conductor');
    res.status(200).json(reservas);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener reservas', error });
  }
};

const getReservaById = async (req, res) => {
  try {
    const reserva = await Reserva.findById(req.params.id)
      .populate('usuario', 'userName email')
      .populate('vehiculo')
      .populate('conductor');

    if (!reserva) {
      return res.status(404).json({ message: 'Reserva no encontrada' });
    }

    res.status(200).json(reserva);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener reserva', error });
  }
};

const actualizarReserva = async (req, res) => {
  try {
    const { fechaInicio, fechaFin, vehiculo, conductor, motivoCancelacion } = req.body;
    const { id } = req.params;

    const reservaExistente = await Reserva.findById(id);
    if (!reservaExistente) {
      return res.status(404).json({ message: 'Reserva no encontrada' });
    }

    if (reservaExistente.estado === 'Cancelada') {
      reservaExistente.motivoCancelacion = motivoCancelacion || '';
      await reservaExistente.save();
      return res.status(200).json({ message: 'Motivo de cancelación actualizado', reserva: reservaExistente });
    }

    const reservasSolapadas = await Reserva.find({
      _id: { $ne: id },
      vehiculo,
      estado: 'Activa',
      $or: [
        { fechaInicio: { $lte: fechaFin }, fechaFin: { $gte: fechaInicio } }
      ]
    });

    if (reservasSolapadas.length > 0) {
      return res.status(400).json({ message: 'El vehículo ya está reservado en ese rango' });
    }

    reservaExistente.fechaInicio = fechaInicio;
    reservaExistente.fechaFin = fechaFin;
    reservaExistente.vehiculo = vehiculo;
    reservaExistente.conductor = conductor;

    await reservaExistente.save();

    res.status(200).json({ message: 'Reserva actualizada', reserva: reservaExistente });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar reserva', error });
  }
};

const cancelarReserva = async (req, res) => {
  try {
    const { id } = req.params;
    const { motivoCancelacion } = req.body;

    const reserva = await Reserva.findById(id);

    if (!reserva) {
      return res.status(404).json({ message: 'Reserva no encontrada' });
    }

    reserva.estado = 'Cancelada';
    reserva.motivoCancelacion = motivoCancelacion || 'Sin especificar';
    await reserva.save();

    res.status(200).json({ message: 'Reserva cancelada correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al cancelar reserva', error });
  }
};

const eliminarReserva = async (req, res) => {
  try {
    const { id } = req.params;

    const reserva = await Reserva.findByIdAndDelete(id);
    if (!reserva) {
      return res.status(404).json({ message: 'Reserva no encontrada para eliminar' });
    }

    res.status(200).json({ message: 'Reserva eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar reserva', error });
  }
};

const comprobarDisponibilidad = async (req, res) => {
  try {
    let { id, vehiculo, conductor, fechaInicio, fechaFin } = req.body;

    if (!fechaInicio || !fechaFin) {
      return res.status(400).json({ message: 'Debes proporcionar un rango de fechas válido' });
    }

    if (id && mongoose.Types.ObjectId.isValid(id)) {
      id = new mongoose.Types.ObjectId(id);
    }
    if (vehiculo && mongoose.Types.ObjectId.isValid(vehiculo)) {
      vehiculo = new mongoose.Types.ObjectId(vehiculo);
    }
    if (conductor && mongoose.Types.ObjectId.isValid(conductor)) {
      conductor = new mongoose.Types.ObjectId(conductor);
    }

    const condicionesFechas = [
      { fechaInicio: { $lte: fechaFin }, fechaFin: { $gte: fechaInicio } }
    ];

    const result = {
      vehiculoDisponible: true,
      conductorDisponible: true
    };

    if (vehiculo) {
      const conflictoVehiculo = await Reserva.exists({
        _id: { $ne: id },
        vehiculo,
        estado: 'Activa',
        $or: condicionesFechas
      });
      result.vehiculoDisponible = !conflictoVehiculo;
    }

    if (conductor) {
      const conflictoConductor = await Reserva.exists({
        _id: { $ne: id },
        conductor,
        estado: 'Activa',
        $or: condicionesFechas
      });
      result.conductorDisponible = !conflictoConductor;
    }

    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return res.status(500).json({ message: 'Error al comprobar disponibilidad', error: error.message });
  }
};

const reactivarReserva = async (req, res) => {
  try {
    const { id } = req.params;

    const reserva = await Reserva.findById(id);

    if (!reserva) {
      return res.status(404).json({ message: 'Reserva no encontrada' });
    }

    if (reserva.estado !== 'Cancelada') {
      return res.status(400).json({ message: 'Solo se pueden reactivar reservas canceladas' });
    }

    reserva.estado = 'Activa';
    reserva.motivoCancelacion = undefined;

    await reserva.save();

    res.status(200).json({ message: 'Reserva reactivada correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al reactivar reserva', error: error.message });
  }
};

module.exports = {
  crearReserva,
  getReservas,
  getReservaById,
  actualizarReserva,
  cancelarReserva,
  eliminarReserva,
  comprobarDisponibilidad,
  reactivarReserva
};

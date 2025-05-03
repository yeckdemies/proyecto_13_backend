const Reserva = require('../models/reserva.model');
const Vehiculo = require('../models/vehiculo.model');
const Conductor = require('../models/conductor.model');
const mongoose = require('mongoose');
const { comprobarSolapamientos, validarFechas } = require('../../helpers/reservas');

const getReservas = async (req, res, next) => {
  try {
    const reservas = await Reserva.find().populate('vehiculo', 'matricula')
    .populate('conductor', 'nombre');
    res.status(200).json(reservas);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener reservas', error });
  }
};

const getReservaById = async (req, res, next) => {
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

const crearReserva = async (req, res, next) => {
  try {
    const { vehiculo, conductor, fechaInicio, fechaFin } = req.body;
    const usuario = req.user._id;

    const errorFechas = validarFechas(fechaInicio, fechaFin);
    if (errorFechas) return res.status(400).json({ message: errorFechas });

    const disponibilidad = await comprobarSolapamientos({ vehiculo, conductor, fechaInicio, fechaFin });
    if (!disponibilidad.vehiculoDisponible)
      return res.status(400).json({ message: 'El vehículo no está disponible en ese rango' });
    if (!disponibilidad.conductorDisponible)
      return res.status(400).json({ message: 'El conductor ya tiene una reserva activa en esas fechas' });

    const nuevaReserva = new Reserva({ usuario, vehiculo, conductor, fechaInicio, fechaFin });
    await nuevaReserva.save();
    return res.status(201).json(nuevaReserva);
  } catch (error) {
    return res.status(500).json({ message: 'Error al crear la reserva', error: error.message });
  }
};

const actualizarReserva = async (req, res, next) => {
  try {
    const { fechaInicio, fechaFin, vehiculo, conductor, motivoCancelacion } = req.body;
    const { id } = req.params;

    const reservaExistente = await Reserva.findById(id);
    if (!reservaExistente) return res.status(404).json({ message: 'Reserva no encontrada' });

    if (reservaExistente.estado === 'Cancelada') {
      reservaExistente.motivoCancelacion = motivoCancelacion || '';
      await reservaExistente.save();
      return res.status(200).json({ message: 'Motivo actualizado', reserva: reservaExistente });
    }

    const errorFechas = validarFechas(fechaInicio, fechaFin);
    if (errorFechas) return res.status(400).json({ message: errorFechas });

    const disponibilidad = await comprobarSolapamientos({ id, vehiculo, conductor, fechaInicio, fechaFin });
    if (!disponibilidad.vehiculoDisponible)
      return res.status(400).json({ message: 'El vehículo no está disponible en ese rango' });
    if (!disponibilidad.conductorDisponible)
      return res.status(400).json({ message: 'El conductor ya tiene una reserva activa en esas fechas' });

    reservaExistente.set({ fechaInicio, fechaFin, vehiculo, conductor });
    await reservaExistente.save();
    return res.status(200).json({ message: 'Reserva actualizada', reserva: reservaExistente });
  } catch (error) {
    return res.status(500).json({ message: 'Error al actualizar reserva', error: error.message });
  }
};

const cancelarReserva = async (req, res, next) => {
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

const eliminarReserva = async (req, res, next) => {
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

const comprobarDisponibilidad = async (req, res, next) => {
  try {
    let { id, vehiculo, conductor, fechaInicio, fechaFin } = req.body;

    if (!fechaInicio || !fechaFin || !vehiculo || !conductor) {
      return res.status(400).json({
        message: 'Todos los campos son obligatorios: vehículo, conductor y rango de fechas.'
      });
    }

    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);

    if (isNaN(inicio) || isNaN(fin)) {
      return res.status(400).json({ message: 'Las fechas no son válidas.' });
    }

    if (inicio >= fin) {
      return res.status(400).json({ message: 'La fecha de fin debe ser posterior a la de inicio.' });
    }

    const condicionesFechas = [
      {
        fechaInicio: { $lte: fin },
        fechaFin: { $gte: inicio }
      }
    ];

    const filtroBase = {
      estado: 'Activa',
      $or: condicionesFechas
    };

    if (id && mongoose.Types.ObjectId.isValid(id)) {
      filtroBase._id = { $ne: id };
    }

    const vehiculoFiltro = { ...filtroBase, vehiculo };
    const conductorFiltro = { ...filtroBase, conductor };

    const [vehiculoSolapado, conductorSolapado] = await Promise.all([
      Reserva.exists(vehiculoFiltro),
      Reserva.exists(conductorFiltro)
    ]);

    return res.status(200).json({
      success: true,
      data: {
        vehiculoDisponible: !vehiculoSolapado,
        conductorDisponible: !conductorSolapado
      }
    });
  } catch (error) {
    console.error('❌ Error en comprobarDisponibilidad:', error);
    return res.status(500).json({
      message: 'Error al comprobar disponibilidad',
      error: error.message
    });
  }
};

const reactivarReserva = async (req, res, next) => {
  try {
    const { id } = req.params;

    const reserva = await Reserva.findById(id);
    if (!reserva) {
      return res.status(404).json({ message: 'Reserva no encontrada' });
    }

    if (reserva.estado !== 'Cancelada') {
      return res.status(400).json({ message: 'Solo se pueden reactivar reservas canceladas' });
    }

    const condicionesFechas = [
      {
        fechaInicio: { $lte: reserva.fechaFin },
        fechaFin: { $gte: reserva.fechaInicio }
      }
    ];

    const [conflictoVehiculo, conflictoConductor] = await Promise.all([
      Reserva.exists({
        _id: { $ne: id },
        vehiculo: reserva.vehiculo,
        estado: 'Activa',
        $or: condicionesFechas
      }),
      Reserva.exists({
        _id: { $ne: id },
        conductor: reserva.conductor,
        estado: 'Activa',
        $or: condicionesFechas
      })
    ]);

    if (conflictoVehiculo) {
      return res.status(400).json({ message: 'No se puede reactivar: el vehículo ya está reservado en ese rango de fechas.' });
    }

    if (conflictoConductor) {
      return res.status(400).json({ message: 'No se puede reactivar: el conductor ya tiene otra reserva en ese rango de fechas.' });
    }

    reserva.estado = 'Activa';
    reserva.motivoCancelacion = '';
    await reserva.save();

    res.status(200).json({ message: 'Reserva reactivada correctamente', reserva });
  } catch (error) {
    console.error('❌ Error al reactivar reserva:', error);
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

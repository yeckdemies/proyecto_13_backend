const Conductor = require('../models/conductor.model');
const Reserva = require ( '../models/reserva.model');

const getAllConductores = async (req, res, next) => {
  try {
    const conductores = await Conductor.find();
    res.status(200).json(conductores);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener conductores', error });
  }
};

const getConductorById = async (req, res, next) => {
  try {
    const conductor = await Conductor.findById(req.params.id);
    if (!conductor) {
      return res.status(404).json({ message: 'Conductor no encontrado' });
    }
    res.status(200).json(conductor);
  } catch (error) {
    res.status(500).json({ message: 'Error al buscar conductor', error });
  }
};

const createConductor = async (req, res, next) => {
  try {
    const newConductor = new Conductor(req.body);
    const saved = await newConductor.save();
    res.status(201).json(saved);
  } catch (error) {
    if (error.code === 11000 && error.keyPattern?.dni) {
      return res.status(400).json({ message: 'Ya existe un conductor con ese DNI' });
    }

    console.error('Error al crear conductor:', error);
    res.status(500).json({ message: 'Error interno al crear conductor' });
  }
};

const updateConductor = async (req, res, next) => {
  try {
    const updated = await Conductor.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });
    if (!updated) {
      return res.status(404).json({ message: 'Conductor no encontrado' });
    }
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar conductor', error });
  }
};

const deleteConductor = async (req, res, next) => {
  const { id } = req.params;
  const eliminarReservas = req.query.eliminarReservas === 'true';

  try {
    const reservas = await Reserva.find({ conductor: id });

    if (reservas.length > 0 && !eliminarReservas) {
      return res.status(409).json({
        message: 'Este conductor tiene reservas asociadas.',
        reservas: reservas.map(r => r._id),
      });
    }

    if (eliminarReservas) {
      await Reserva.deleteMany({ conductor: id });
    }

    const deleted = await Conductor.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Conductor no encontrado' });

    res.status(200).json({ message: 'Conductor eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar conductor', error });
  }
};

module.exports = {
  getAllConductores,
  getConductorById,
  createConductor,
  updateConductor,
  deleteConductor
};

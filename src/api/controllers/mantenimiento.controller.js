const Mantenimiento = require('../models/mantenimiento.model');
const Vehiculo = require('../models/vehiculo.model');
const Proveedor = require('../models/proveedor.model');

const getAllMantenimientos = async (req, res) => {
  try {
    const mantenimientos = await Mantenimiento.find()
      .populate('vehiculo')
      .populate('taller');
    res.status(200).json(mantenimientos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener mantenimientos', error });
  }
};

const getMantenimientoById = async (req, res) => {
  try {
    const mantenimiento = await Mantenimiento.findById(req.params.id)
      .populate('vehiculo')
      .populate('taller');
    if (!mantenimiento) {
      return res.status(404).json({ message: 'Mantenimiento no encontrado' });
    }
    res.status(200).json(mantenimiento);
  } catch (error) {
    res.status(500).json({ message: 'Error al buscar mantenimiento', error });
  }
};

const createMantenimiento = async (req, res) => {
  try {
    const { vehiculo, taller, ...resto } = req.body;
    const vehiculoObj = await Vehiculo.findById(vehiculo);
    const tallerObj = await Proveedor.findById(taller);

    if (!vehiculoObj || !tallerObj) {
      return res.status(400).json({ message: 'Vehículo o taller no válido' });
    }

    const nuevoMantenimiento = new Mantenimiento({
      ...resto,
      vehiculo: vehiculoObj._id,
      taller: tallerObj._id
    });

    const saved = await nuevoMantenimiento.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear mantenimiento', error });
  }
};

// Actualizar
const updateMantenimiento = async (req, res) => {
  try {
    const updated = await Mantenimiento.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ message: 'Mantenimiento no encontrado' });
    }
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar mantenimiento', error });
  }
};

// Eliminar
const deleteMantenimiento = async (req, res) => {
  try {
    const deleted = await Mantenimiento.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Mantenimiento no encontrado' });
    }
    res.status(200).json({ message: 'Mantenimiento eliminado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar mantenimiento', error });
  }
};

module.exports = {
  getAllMantenimientos,
  getMantenimientoById,
  createMantenimiento,
  updateMantenimiento,
  deleteMantenimiento
};

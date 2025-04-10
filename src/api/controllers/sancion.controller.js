const Sancion = require('../models/sancion.model');
const Vehiculo = require('../models/vehicle.model');
const Conductor = require('../models/conductor.model');

const getAllSanciones = async (req, res, next) => {
  try {
    const sanciones = await Sancion.find()
      .populate('vehiculo')
      .populate('conductor');
    res.status(200).json(sanciones);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener sanciones', error });
  }
};

const getSancionById = async (req, res, next) => {
  try {
    const sancion = await Sancion.findById(req.params.id)
      .populate('vehiculo')
      .populate('conductor');
    if (!sancion) {
      return res.status(404).json({ message: 'Sanción no encontrada' });
    }
    res.status(200).json(sancion);
  } catch (error) {
    res.status(500).json({ message: 'Error al buscar sanción', error });
  }
};

const createSancion = async (req, res, next) => {
  try {
    const { vehiculo, conductor, ...resto } = req.body;
    const vehiculoObj = await Vehiculo.findById(vehiculo);
    const conductorObj = conductor ? await Conductor.findById(conductor) : null;

    if (!vehiculoObj) {
      return res.status(400).json({ message: 'Vehículo no válido' });
    }

    const nuevaSancion = new Sancion({
      ...resto,
      vehiculo: vehiculoObj._id,
      conductor: conductorObj?._id || null
    });

    const saved = await nuevaSancion.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear sanción', error });
  }
};

const updateSancion = async (req, res, next) => {
  try {
    const updated = await Sancion.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ message: 'Sanción no encontrada' });
    }
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar sanción', error });
  }
};

const deleteSancion = async (req, res, next) => {
  try {
    const deleted = await Sancion.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Sanción no encontrada' });
    }
    res.status(200).json({ message: 'Sanción eliminada' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar sanción', error });
  }
};

module.exports = {
  getAllSanciones,
  getSancionById,
  createSancion,
  updateSancion,
  deleteSancion
};

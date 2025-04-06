const Conductor = require('../models/conductor.model');

const getAllConductores = async (req, res) => {
  try {
    const conductores = await Conductor.find();
    res.status(200).json(conductores);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener conductores', error });
  }
};

const getConductorById = async (req, res) => {
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

const createConductor = async (req, res) => {
  try {
    const newConductor = new Conductor(req.body);
    const saved = await newConductor.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear conductor', error });
  }
};

const updateConductor = async (req, res) => {
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

const deleteConductor = async (req, res) => {
  try {
    const deleted = await Conductor.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Conductor no encontrado' });
    }
    res.status(200).json({ message: 'Conductor eliminado' });
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

const Vehiculo = require('../models/vehiculo.model');
const Proveedor = require('../models/proveedor.model');
const Conductor = require('../models/conductor.model');

const getAllVehiculos = async (req, res) => {
  try {
    const vehiculos = await Vehiculo.find()
      .populate('proveedor')
      .populate('conductor');
    res.status(200).json(vehiculos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener vehículos', error });
  }
};

const getVehiculoById = async (req, res) => {
  try {
    const vehiculo = await Vehiculo.findById(req.params.id)
      .populate('proveedor')
      .populate('conductor');
    if (!vehiculo) {
      return res.status(404).json({ message: 'Vehículo no encontrado' });
    }
    res.status(200).json(vehiculo);
  } catch (error) {
    res.status(500).json({ message: 'Error al buscar vehículo', error });
  }
};

const createVehiculo = async (req, res) => {
  try {
    const { proveedor, conductor, ...resto } = req.body;

    const proveedorObj = await Proveedor.findById(proveedor);
    const conductorObj = conductor ? await Conductor.findById(conductor) : null;

    if (!proveedorObj) {
      return res.status(400).json({ message: 'Proveedor no válido' });
    }

    const newVehiculo = new Vehiculo({
      ...resto,
      proveedor: proveedorObj._id,
      conductor: conductorObj?._id || null
    });

    const saved = await newVehiculo.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear vehículo', error });
  }
};

const updateVehiculo = async (req, res) => {
  try {
    const updated = await Vehiculo.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });
    if (!updated) {
      return res.status(404).json({ message: 'Vehículo no encontrado' });
    }
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar vehículo', error });
  }
};

const deleteVehiculo = async (req, res) => {
  try {
    const deleted = await Vehiculo.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Vehículo no encontrado' });
    }
    res.status(200).json({ message: 'Vehículo eliminado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar vehículo', error });
  }
};

module.exports = {
  getAllVehiculos,
  getVehiculoById,
  createVehiculo,
  updateVehiculo,
  deleteVehiculo
};

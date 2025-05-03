const Proveedor = require('../models/proveedor.model');
const Vehiculo = require('../models/vehiculo.model');

const getAllProveedores = async (req, res, next) => {
  try {
    const proveedores = await Proveedor.find();
    res.status(200).json(proveedores);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener proveedores', error });
  }
};

const getProveedorById = async (req, res, next) => {
  try {
    const proveedor = await Proveedor.findById(req.params.id);
    if (!proveedor) {
      return res.status(404).json({ message: 'Proveedor no encontrado' });
    }
    res.status(200).json(proveedor);
  } catch (error) {
    res.status(500).json({ message: 'Error al buscar proveedor', error });
  }
};

const createProveedor = async (req, res, next) => {
  try {
    const nuevoProveedor = new Proveedor(req.body);
    await nuevoProveedor.save();
    res.status(201).json(nuevoProveedor);
  } catch (error) {
    if (error.code === 11000 && error.keyPattern?.nif) {
      return res.status(400).json({ message: 'Ya existe un proveedor con ese CIF/NIF' });
    }

    console.error('Error al crear proveedor:', error);
    res.status(500).json({ message: 'Error interno al crear proveedor' });
  }
};

const updateProveedor = async (req, res, next) => {
  try {
    const updated = await Proveedor.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });
    if (!updated) {
      return res.status(404).json({ message: 'Proveedor no encontrado' });
    }
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar proveedor', error });
  }
};

const deleteProveedor = async (req, res, next) => {
  const { id } = req.params;

  try {
    const vehiculosAsociados = await Vehiculo.find({ proveedor: id });

    if (vehiculosAsociados.length > 0) {
      return res.status(409).json({
        message: 'No se puede eliminar el proveedor porque está asignado a uno o más vehículos.',
        vehiculos: vehiculosAsociados.map(v => ({
          id: v._id,
          matricula: v.matricula
        })),
      });
    }

    const deleted = await Proveedor.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Proveedor no encontrado' });

    res.status(200).json({ message: 'Proveedor eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar proveedor', error });
  }
};

module.exports = {
  getAllProveedores,
  getProveedorById,
  createProveedor,
  updateProveedor,
  deleteProveedor
};

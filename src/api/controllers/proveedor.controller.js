const Proveedor = require('../models/proveedor.model');

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
    const newProveedor = new Proveedor(req.body);
    const saved = await newProveedor.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear proveedor', error });
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
  try {
    const deleted = await Proveedor.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Proveedor no encontrado' });
    }
    res.status(200).json({ message: 'Proveedor eliminado' });
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

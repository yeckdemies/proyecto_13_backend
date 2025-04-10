const MetodoPago = metodoPago = require('../models/metodopago.model');
const Proveedor = require('../models/proveedor.model');

const getAllMetodosPago = async (req, res, next) => {
  try {
    const metodos = await MetodoPago.find().populate('proveedor');
    res.status(200).json(metodos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener métodos de pago', error });
  }
};

const getMetodoPagoById = async (req, res, next) => {
  try {
    const metodo = await MetodoPago.findById(req.params.id).populate('proveedor');
    if (!metodo) {
      return res.status(404).json({ message: 'Método de pago no encontrado' });
    }
    res.status(200).json(metodo);
  } catch (error) {
    res.status(500).json({ message: 'Error al buscar método de pago', error });
  }
};

const createMetodoPago = async (req, res, next) => {
  try {
    const { proveedor, ...resto } = req.body;
    const proveedorObj = await Proveedor.findById(proveedor);
    if (!proveedorObj) {
      return res.status(400).json({ message: 'Proveedor no válido' });
    }

    const newMetodo = new MetodoPago({
      ...resto,
      proveedor: proveedorObj._id
    });

    const saved = await newMetodo.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear método de pago', error });
  }
};

const updateMetodoPago = async (req, res, next) => {
  try {
    const updated = await MetodoPago.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ message: 'Método de pago no encontrado' });
    }
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar método de pago', error });
  }
};

const deleteMetodoPago = async (req, res, next) => {
  try {
    const deleted = await MetodoPago.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Método de pago no encontrado' });
    }
    res.status(200).json({ message: 'Método de pago eliminado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar método de pago', error });
  }
};

module.exports = {
  getAllMetodosPago,
  getMetodoPagoById,
  createMetodoPago,
  updateMetodoPago,
  deleteMetodoPago
};

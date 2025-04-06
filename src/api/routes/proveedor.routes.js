const express = require('express');
const {
  getAllProveedores,
  getProveedorById,
  createProveedor,
  updateProveedor,
  deleteProveedor
} = require('../controllers/proveedor.controller');
const {isAuth} = require('../../middlewares/auth');
const {isAdmin} = require('../../middlewares/role');

const proveedorRouter = express.Router();

proveedorRouter.get('/', isAuth, getAllProveedores);
proveedorRouter.get('/:id', isAuth, getProveedorById);

proveedorRouter.post('/', isAuth, isAdmin, createProveedor);
proveedorRouter.put('/:id', isAuth, isAdmin, updateProveedor);
proveedorRouter.delete('/:id', isAuth, isAdmin, deleteProveedor);

module.exports = proveedorRouter;

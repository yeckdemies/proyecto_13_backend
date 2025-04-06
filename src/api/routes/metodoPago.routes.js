const express = require('express');
const {
  getAllMetodosPago,
  getMetodoPagoById,
  createMetodoPago,
  updateMetodoPago,
  deleteMetodoPago
} = require('../controllers/metodoPago.controller');
const {isAuth} = require('../../middlewares/auth');
const {isAdmin} = require('../../middlewares/role');

const metodoPagoRouter = express.Router();

metodoPagoRouter.get('/', isAuth, getAllMetodosPago);
metodoPagoRouter.get('/:id', isAuth, getMetodoPagoById);

metodoPagoRouter.post('/', isAuth, isAdmin, createMetodoPago);
metodoPagoRouter.put('/:id', isAuth, isAdmin, updateMetodoPago);
metodoPagoRouter.delete('/:id', isAuth, isAdmin, deleteMetodoPago);

module.exports = metodoPagoRouter;

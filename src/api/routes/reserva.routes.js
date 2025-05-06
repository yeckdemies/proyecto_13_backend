const express = require('express');
const {
  crearReserva,
  getReservas,
  getReservaById,
  actualizarReserva,
  cancelarReserva,
  eliminarReserva,
  comprobarDisponibilidad,
  reactivarReserva
} = require('../controllers/reserva.controller');
const { isAuth } = require('../../middlewares/auth');
const { isAdmin } = require('../../middlewares/role');

const reservaRouter = express.Router();

reservaRouter.get('/', isAuth, getReservas);
reservaRouter.get('/:id', isAuth, getReservaById);
reservaRouter.post('/', isAuth, crearReserva);
reservaRouter.post('/disponibilidad', isAuth, comprobarDisponibilidad);
reservaRouter.put('/:id', isAuth, actualizarReserva);
reservaRouter.patch('/:id/cancelar', isAuth, cancelarReserva);
reservaRouter.delete('/:id', [isAuth, isAdmin], eliminarReserva);

reservaRouter.patch('/:id/reactivar', isAuth, reactivarReserva);

module.exports = reservaRouter;


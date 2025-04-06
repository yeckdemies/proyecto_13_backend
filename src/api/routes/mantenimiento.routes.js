const express = require('express');
const {
  getAllMantenimientos,
  getMantenimientoById,
  createMantenimiento,
  updateMantenimiento,
  deleteMantenimiento
} = require('../controllers/mantenimiento.controller');
const {isAuth} = require('../../middlewares/auth');
const {isAdmin} = require('../../middlewares/role');

const mantenimientoRouter = express.Router();

mantenimientoRouter.get('/', isAuth, getAllMantenimientos);
mantenimientoRouter.get('/:id', isAuth, getMantenimientoById);

mantenimientoRouter.post('/', isAuth, isAdmin, createMantenimiento);
mantenimientoRouter.put('/:id', isAuth, isAdmin, updateMantenimiento);
mantenimientoRouter.delete('/:id', isAuth, isAdmin, deleteMantenimiento);

module.exports = mantenimientoRouter;

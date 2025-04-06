const express = require('express');
const {
  getAllSanciones,
  getSancionById,
  createSancion,
  updateSancion,
  deleteSancion
} = require('../controllers/sancion.controller');
const {isAuth} = require('../../middlewares/auth');
const {isAdmin} = require('../../middlewares/role');

const sancionRouter = express.Router();

sancionRouter.get('/', isAuth, getAllSanciones);
sancionRouter.get('/:id', isAuth, getSancionById);

sancionRouter.post('/', isAuth, isAdmin, createSancion);
sancionRouter.put('/:id', isAuth, isAdmin, updateSancion);
sancionRouter.delete('/:id', isAuth, isAdmin, deleteSancion);

module.exports = sancionRouter;

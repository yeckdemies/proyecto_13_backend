const express = require('express');
const {
  getAllUser,
  registerUser,
  loginUser,
  getCurrentUser,
  updateUser,
  deleteUser,
  changePassword
} = require('../controllers/user.controller');
const { isAuth } = require('../../middlewares/auth');
const { isAdmin } = require('../../middlewares/role');

const userRouter = express.Router();

userRouter.get('/', [isAuth, isAdmin], getAllUser);
userRouter.get('/me', isAuth, getCurrentUser);
userRouter.put('/changePassword', isAuth, changePassword);
userRouter.put('/:id', isAuth, updateUser);
userRouter.post('/register', [isAuth, isAdmin], registerUser);
userRouter.post('/login', loginUser);
userRouter.delete('/deleteUser/:id', [isAuth, isAdmin], deleteUser);


module.exports = userRouter;

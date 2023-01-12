import express from 'express';
import controller from './controller';
import Validation from '../../middlewares/validation.helper';
import TokenHandler from '../../middlewares/jwt.helper';

export default express
  //---------------------------------------@FA Authentication route start ----------------------------//
  .Router()
  .post('/generate', TokenHandler.verifyToken, controller.getUser)
  .post('/verify', TokenHandler.verifyToken, controller.verifyUser)
  .post('/login_verify', controller.loginVerifyUser)
  .post('/validStatus', TokenHandler.verifyToken, controller.disableStatus)
  .get('/status', TokenHandler.verifyToken, controller.checkStatus);
//---------------------------------------@FA Authentication route End ----------------------------//

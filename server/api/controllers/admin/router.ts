/* eslint-disable prettier/prettier */
import express from 'express';
import controller from './controller';
import TokenHandler from '../../middlewares/jwt.helper';
export default express
  //Router file to define all routes
  //-------------------------Start -------------------------------------//
  .Router()
  .get('/', controller.healthCheck) //healthcheck api
  .get('/usersList', controller.usersList)
  .post('/register', controller.adminRegister)
  .post('/login', controller.adminLogin)
  .get('/creators/all', controller.featuredAllCreator)
  .get('/graph', controller.graph)
  .post('/wallet', TokenHandler.verifyToken, controller.createWallet)
  .get('/wallet', TokenHandler.verifyToken, controller.getWallet)
  .post('/createAdminRoleType', controller.createAdminRoleType);

//------------------------------------End------------------------------//


//-------------------------shaivik route start here---------------///




//-------------------------shaivik route End here---------------///


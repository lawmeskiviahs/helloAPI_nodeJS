import express from 'express';
import controller from './controller';
import TokenHandler from '../../middlewares/jwt.helper';
import ValidationHandler from '../../middlewares/validation.helper';
export default express
  //---------------------------------------Royalty Router start----------------------//
  .Router()
  .post(
    '/save_adminRoyalty',
    ValidationHandler.adminRoyaltyValidation,TokenHandler.verifyToken,
    controller.adminRoyalty
  )
  .get('/get_royalty', controller.getRoyalty);
//---------------------------------Royalty Router End------------------------------------------//

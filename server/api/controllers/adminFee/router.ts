import express from 'express';
import controller from './controllers';
import TokenHandler from '../../middlewares/jwt.helper';
import ValidationHandler from '../../middlewares/validation.helper';
export default express
  //-----------------------------------Admin Fee Router Start---------------------//
  .Router()
  .post(
    '/save_adminFee',
    ValidationHandler.adminFeesValidation,TokenHandler.verifyToken,
    controller.AdminFee
  )
  .get('/get_fees', controller.getFees)
  .post(
    '/save_adminBanner',
    ValidationHandler.adminBannerValidation,TokenHandler.verifyToken,
    controller.homePageBanner
  )
  .get('/get_banner', controller.getBanner)
  .get('/getisFeaturedBanner', controller.getisFeaturedBanner);

//-----------------------------------Admin Fee Router End---------------------//

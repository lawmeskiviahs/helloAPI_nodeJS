import sequelize from '../db/connection';
import AdminFeeModel from '../models/admin.fees.model';
import l from '../../common/logger';
import AdminBannerModel from '../models/homePageBanner.model';
import { MESSAGES } from '../constant/response.messages';

class AdminFeeHelper {
  /**
   * function for create admin fee
   * @param req
   * @param res
   * @returns
   */
  public async createAdminFee(payload: any) {
    try {
      /**
       * Payload to create admin fee
       */
      const adminFee = {
        fees: payload.fees,
        types: payload.types,
        is_active: payload.is_active,
      };
      console.log(adminFee, 'adminFee');
      /**
       * Query to create admin fee in admin_fees table
       */
      const feeCreation = await sequelize.transaction(async (t: any) => {
        const responseData = await AdminFeeModel.create(adminFee, {
          transaction: t,
        });
        return responseData;
      });
      return feeCreation;
    } catch (err: any) {
      l.error('err: ', err);
      return {
        error: true,
        message: err.message,
      };
    }
  }

  /**
   * function for update admin fees
   * @param req
   * @param res
   * @returns
   */
  public async updateAdminFee(data: any, conditionValue: any) {
    try {
      let udpateHook = false;
      console.log(data, conditionValue, 'datavalue');
      const [affectedRows] = await AdminFeeModel.update(data, {
        where: conditionValue,
        individualHooks: udpateHook,
      });
      return affectedRows;
    } catch (err: any) {
      l.error('err userUpdate : ', err);
      return {
        error: true,
        message: err.message,
      };
    }
  }

  /**
   * function for check fees by id
   * @param req
   * @param res
   * @returns <{message, error}>
   */

  public async checkFeeById(feesId: any): Promise<any> {
    console.log('inside checkByIdInUserMeta function', feesId);

    const getFeesInfo: any = await AdminFeeModel.findOne({
      where: {
        admin_fees_id: feesId,
      },
      order: [['createdAt', 'DESC']],
    });
    console.log('getFeesInfo:::::', getFeesInfo);
    if (getFeesInfo) {
      return getFeesInfo;
    } else {
      return false;
    }
  }

  /**
   * function for get fees all
   * @param req
   * @param res
   * @returns <{message, error}>
   */
  public async getFees(): Promise<any> {
    try {
      /**
       * query to get admin fee details
       */
      const isCheck: any = await AdminFeeModel.findAll({
        raw: true,
        attributes: ['admin_fees_id', 'fees', 'types', 'is_active'],
      });
      console.log(isCheck, 'isCheck');
      return {
        error: false,
        data: isCheck,
      };
    } catch (error: any) {
      return {
        error: true,
        message: error.message,
      };
    }
  }
  /**
   * function for get banner
   * @param req
   * @param res
   * @returns
   */
  public async getBanner(): Promise<any> {
    try {
      const isCheck: any = await AdminBannerModel.findAll({
        raw: true,
        attributes: ['bannerImageId', 'banner', 'isActive', 'isFeatured'],
      });
      console.log(isCheck, 'isCheck');
      return {
        error: false,
        data: isCheck,
      };
    } catch (error: any) {
      return {
        error: true,
        message: MESSAGES.CATCHMESSAGE.ERROR,
      };
    }
  }

  /**
   * function for create banner
   * @param req
   * @param res
   * @returns
   */
  public async createBanner(payload: any) {
    try {
      /**
       * Banner Payload to create banner details
       */
      const adminBanner = {
        banner: payload.banner,
        isFeatured: payload.isFeatured,
        isActive: payload.isActive,
      };
      console.log(adminBanner, 'adminBanner');
      /**
       * Query to create admin banner
       */
      const feeCreation = await sequelize.transaction(async (t: any) => {
        const responseData = await AdminBannerModel.create(adminBanner, {
          transaction: t,
        });
        console.log(responseData, 'responseDataresponseData');
        return responseData;
      });
      return feeCreation;
    } catch (err: any) {
      l.error('err: ', err);
      return {
        error: true,
        message: err.message,
      };
    }
  }

  /**
   * function for update banner
   * @param req
   * @param res
   * @returns
   */
  public async updateBanner(data: any, conditionValue: any) {
    try {
      let udpateHook = false;
      console.log(data, conditionValue, 'datavalue');
      /**
       * Query to update banner details
       */
      const [affectedRows] = await AdminBannerModel.update(data, {
        where: conditionValue,
        individualHooks: udpateHook,
      });
      return affectedRows;
    } catch (err: any) {
      l.error('err updateBanner : ', err);
      return {
        error: true,
        message: err.message,
      };
    }
  }
  /**
   * function for get featured banner
   * @param req
   * @param res
   * @returns
   */
  public async getIsFeaturedBanner(): Promise<any> {
    try {
      /**
       * Query to get admin Featured Banner
       */
      const isCheck: any = await AdminBannerModel.findAll({
        where: {
          isFeatured: 1,
        },
        raw: true,
        attributes: ['bannerImageId', 'banner', 'isActive', 'isFeatured'],
      });
      console.log(isCheck, 'isCheck');
      return {
        error: false,
        data: isCheck,
      };
    } catch (error: any) {
      l.error('err updateBanner : ', error);
      return {
        error: true,
        message: MESSAGES.CATCHMESSAGE.ERROR,
      };
    }
  }
}

export default new AdminFeeHelper();

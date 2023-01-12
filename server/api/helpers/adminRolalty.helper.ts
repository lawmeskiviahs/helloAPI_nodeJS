import sequelize from '../db/connection';
import l from '../../common/logger';
import AdminRoyaltyModel from '../models/admin.royalty.model';

class AdminFeeHelper {
  /**
   * function for get royalty
   * @param req
   * @param res
   * @returns <{message, error}>
   */
  public async getRoyalty(): Promise<any> {
    try {
      /**
       * Query to get royalty detail from admin_royalty table
       */
      const isCheck: any = await AdminRoyaltyModel.findAll({
        raw: true,
        attributes: ['admin_royalty_id', 'royalty', 'types', 'is_active'],
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
   * function for create royalty by admin
   * @param req
   * @param res
   * @returns
   */
  public async createAdminRoyalty(payload: any) {
    try {
      const adminRolalty = {
        royalty: payload.royalty,
        types: payload.types,
        is_active: payload.is_active,
      };
      console.log(adminRolalty, 'adminRolalty');
      /**
       * query to insert data into royality table
       */
      const feeCreation = await sequelize.transaction(async (t: any) => {
        const responseData = await AdminRoyaltyModel.create(adminRolalty, {
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
   * function for update admin royalty
   * @param req
   * @param res
   * @returns
   */
  public async updateAdminRoyalty(data: any, conditionValue: any) {
    try {
      let udpateHook = false;
      console.log(data, conditionValue, 'datavalue');
      const [affectedRows] = await AdminRoyaltyModel.update(data, {
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
}

export default new AdminFeeHelper();

import { Request, Response } from 'express';
import SetResponse from '../../response/response.helper';
import * as Interfaces from '../../interfaces';
import { RESPONSES } from '../../constant/response';
import AdminRoyaltyHelper from '../../helpers/adminRolalty.helper';
import { MESSAGES } from '../../constant/response.messages';

export class Controller {
  /**
   * Api to create and update Rolalty
   * @param req royalty,types,is_active
   * @param res
   * @returns{messgae}
   */
  adminRoyalty = async (
    req: Request,
    res: Response
  ): Promise<Interfaces.PromiseResponse> => {
    try {

      if (req.userId != '1') {
        throw { message:MESSAGES.ADMIN.EDIT };
      } 
      
      const { royalty, types, is_active } = req.body; // destructue req body
      const payload: any = {
        royalty,
        types,
        is_active,
      };
      /**
       * function to get royality details if data exits in royality table
       */
      const detail = await AdminRoyaltyHelper.getRoyalty();
      /**
       * if royality does't exits in royality table
       */
      if (detail.data.length == 0) {
        /**
         * function to set or create data into royality table
         */
        const createAdminRolalty: any =
          await AdminRoyaltyHelper.createAdminRoyalty(payload);
        if (createAdminRolalty.error == true) {
          throw MESSAGES.CATCHMESSAGE.ERROR;
        }
        return SetResponse.success(res, RESPONSES.SUCCESS, {
          message: MESSAGES.ROYALTY.SUCCESS,
          error: false,
        });
      }
      /**
       * function to update royality table data if data already exits in table
       */
      const updateAdminRoyalty: any =
        await AdminRoyaltyHelper.updateAdminRoyalty(payload, {
          admin_royalty_id: detail.data[0].admin_royalty_id,
        });
      if (updateAdminRoyalty == 0) {
        throw MESSAGES.CATCHMESSAGE.ERROR;
      }
      return SetResponse.success(res, RESPONSES.SUCCESS, {
        message: MESSAGES.ROYALTY.UPDATE_SUCCESS,
        error: false,
      });
    } catch (error: any) {
      console.log('adminRoyalty error: ', error);
      return SetResponse.error(res, error.status | RESPONSES.BADREQUEST, {
        message: error,
        error: true,
      });
    }
  };

  /**
   * Api to get rolalty
   * @param req
   * @param res
   * @returns
   */
  getRoyalty = async (
    req: Request,
    res: Response
  ): Promise<Interfaces.PromiseResponse> => {
    try {
      const feesId: string = req.params.feesId as string; // destructue  req.params
      /**
       * function to get royality details
       */
      const detail = await AdminRoyaltyHelper.getRoyalty();
      if (!detail) {
        throw 'No Data Found';
      }

      return SetResponse.success(res, RESPONSES.SUCCESS, {
        data: detail?.data,
        status: 200,
        error: false,
      });
    } catch (error: any) {
      console.log('getFees error:: ', error);
      return SetResponse.error(res, error.status | 400, {
        message: MESSAGES.CATCHMESSAGE.ERROR,
        error: true,
      });
    }
  };
}
export default new Controller();

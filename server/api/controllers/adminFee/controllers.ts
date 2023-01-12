import { Request, Response } from 'express';
import SetResponse from '../../response/response.helper';
import * as Interfaces from '../../interfaces';
import { RESPONSES } from '../../constant/response';
import AdminFeeHelper from '../../helpers/adminFee.helper';
import { MESSAGES } from '../../constant/response.messages';
import { Message } from 'google-protobuf';

export class Controller {
  /**
   * Api to get fees
   * @param req
   * @param res
   * @returns
   */
  getFees = async (
    req: Request,
    res: Response
  ): Promise<Interfaces.PromiseResponse> => {
    try {
      const feesId: string = req.params.feesId as string; // destructure  req.params
      /**
       * function to get admin fee detail
       */
      const detail = await AdminFeeHelper.getFees();
      if (!detail) {
        throw { message: 'No Data Found' };
      }

      return SetResponse.success(res, RESPONSES.SUCCESS, {
        message: MESSAGES.FEE.GET,
        error: false,
        data: detail?.data,
      });
    } catch (error: any) {
      console.log('getFees error:: ', error);
      return SetResponse.error(res, error.status | 400, {
        message: error.message,
        error: true,
      });
    }
  };

  /**
   * Api to create and update fees
   * @param req fees,types,is_active
   * @param res
   * @returns{message}
   */
  AdminFee = async (
    req: Request,
    res: Response
  ): Promise<Interfaces.PromiseResponse> => {
    try {

      if (req.userId != '1') {
        throw { message:MESSAGES.ADMIN.EDIT };
      } 
      const { fees, types, is_active } = req.body; // destructure req.body
      /**
       * Payload to craete admin fee data
       */
      const payload: any = {
        fees,
        types,
        is_active,
      };
      /**
       * function to get admin fee
       */
      const detail = await AdminFeeHelper.getFees();
      /**
       * function to create fees if data does't exits in fee table
       */
      if (detail.data.length == 0) {
        /**
         * function to create admin fee details
         */
        const createAdminFee: any = await AdminFeeHelper.createAdminFee(
          payload
        );

        if (!!createAdminFee.error == true) {
          throw { message: MESSAGES.CATCHMESSAGE.ERROR };
        }
        return SetResponse.success(res, RESPONSES.SUCCESS, {
          message: MESSAGES.FEE.SUCCESS,
          error: false,
        });
      }
      /**
       * function to update fees
       */
      const updateAdminFee: any = await AdminFeeHelper.updateAdminFee(payload, {
        admin_fees_id: detail.data[0].admin_fees_id,
      });
      if (updateAdminFee == 0) {
        throw { message: 'Something went wrong' };
      }
      return SetResponse.success(res, RESPONSES.SUCCESS, {
        message: MESSAGES.FEE.UPDATE_SUCCESS,
        error: false,
      });
    } catch (error: any) {
      console.log('AdminFee error: ', error);
      return SetResponse.error(res, error.status | RESPONSES.BADREQUEST, {
        message: error.message,
        error: true,
      });
    }
  };

  /**
   * Api to create and update baner
   * @param req banner,isFeatured,isActive
   * @param res
   * @returns
   */

  homePageBanner = async (
    req: Request,
    res: Response
  ): Promise<Interfaces.PromiseResponse> => {
    try {

      console.log('req.userIdreq.userId:', req.userId);

      if (req.userId != '1') {
        throw { message:MESSAGES.ADMIN.EDIT };
      } 
        
        // MESSAGES.ADMIN.NOT_ADMIN
      
      const { banner, isFeatured, isActive } = req.body; //destructure req body
      /**
       * payload to create banner
       */
      const payload: any = {
        banner,
        isFeatured,
        isActive,
      };
      /**
       * function to get banner details
       */
      const detail = await AdminFeeHelper.getBanner();
      console.log('detaildetaildetail', detail);

      /**
       * function to create banner if banner data does't exits in banner table
       */

      if (detail.data.length == 0) {
        /**
         * function to create banner
         */
        const createBanner: any = await AdminFeeHelper.createBanner(payload);
        if (!!createBanner.error == true) {
          throw { message: MESSAGES.CATCHMESSAGE.ERROR };
        }
        return SetResponse.success(res, RESPONSES.SUCCESS, {
          message: MESSAGES.BANNER.SUCCESS,
          error: false,
        });
      }
      /**
       * function to update banner
       */
      const updateBanner: any = await AdminFeeHelper.updateBanner(payload, {
        bannerImageId: detail.data[0].bannerImageId,
      });
      if (updateBanner == 0) {
        throw { message: MESSAGES.CATCHMESSAGE.ERROR };
      }
      return SetResponse.success(res, RESPONSES.SUCCESS, {
        message: MESSAGES.BANNER.UPDATE_SUCCESS,
        error: false,
      })
    } catch (error: any) {
      console.log('homePageBanner error: ', error);
      return SetResponse.error(res, error.status | RESPONSES.BADREQUEST, {
        message: error.message,
        error: true,
      });
    }
  };

  /**
   * Api to get banner
   * @param req
   * @param res
   * @returns{message,error,data}
   */
  getBanner = async (
    req: Request,
    res: Response
  ): Promise<Interfaces.PromiseResponse> => {
    try {
      const feesId: string = req.params.feesId as string; // destructure req params
      /**
       * function to get banner details
       */
      const detail = await AdminFeeHelper.getBanner();
      if (!detail) {
        throw { message: MESSAGES.CATCHMESSAGE.NOT_FOUND };
      }

      return SetResponse.success(res, RESPONSES.SUCCESS, {
        message: MESSAGES.BANNER.GET,
        error: false,
        data: detail?.data,
      });
    } catch (error: any) {
      console.log('getFees error:: ', error);
      return SetResponse.error(res, error.status | 400, {
        message: error.message,
        error: true,
      });
    }
  };

  /**
   * Api to get Featured banner
   * @param req
   * @param res
   * @returns{message,error,data}MESSAGES.CATCHMESSAGE.ERROR
   */

  getisFeaturedBanner = async (
    req: Request,
    res: Response
  ): Promise<Interfaces.PromiseResponse> => {
    try {
      const isFeatured: any = req.body; // destructure req body
      /**
       * function to get Featured Banner
       */
      const detail = await AdminFeeHelper.getIsFeaturedBanner();

      console.log('detaildetail', detail);
      if (!detail || detail.data.length === 0) {
        return SetResponse.success(res, 200, {
          message: MESSAGES.BANNER.FETURED_BANNER_NOT_FOUND,
          error: false,
        });
      }
      return SetResponse.success(res, RESPONSES.SUCCESS, {
        message: MESSAGES.BANNER.FOUND,
        error: false,
        data: detail?.data,
      });
    } catch (error: any) {
      console.log('getFees error:: ', error);
      return SetResponse.error(res, error.status | 400, {
        message: error.message,
        error: true,
      });
    }
  };
}
export default new Controller();

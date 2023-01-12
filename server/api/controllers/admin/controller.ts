/* eslint-disable prettier/prettier */
import { Request, Response } from 'express';
import SetResponse from '../../response/response.helper';
import * as Interfaces from '../../interfaces';
import { RESPONSES } from '../../constant/response';
import { MESSAGES } from '../../constant/response.messages';
import TokenHandler from './../../middlewares/jwt.helper';
import AdminHelper from '../../helpers/admin.helper';
import redisHelper from '../../helpers/redis.helper';
import nodeMailer from 'nodemailer';
import { string } from 'joi';
import AdminUsersModel from '../../models/adminUsers.model';
const ejs = require('ejs');
const { userClient, nftClient } = require('../../../../proto/client.js');
const MAILERCONFIG = {
  host: process.env.NODE_MAILER_HOST as string,
  port: Number(process.env.NODE_MAILER_PORT),
  auth: {
    user: process.env.NODE_MAILER_USER,
    pass: process.env.NODE_MAILER_PASS,
  },
};
const transporter = nodeMailer.createTransport(MAILERCONFIG);
export class Controller {
  /**
   * Api For health check of Admin Service
   * @param req
   * @param res
   * @returns{message}
   */
  healthCheck = async (
    req: Request,
    res: Response
  ): Promise<Interfaces.PromiseResponse> => {
    console.log('req.body; ', req.body);
    return SetResponse.success(res, RESPONSES.SUCCESS, {
      data: {},
      message: MESSAGES.HEALTH_CHECK.SUCCESS,
      error: false,
    });
  };
  /**
   * Api for admin login
   * @param req
   * @param res
   * @returns{}
   */
  adminLogin = async (
    req: Request,
    res: Response
  ): Promise<Interfaces.PromiseResponse> => {
    try {
      const { username, password } = req.body; // destructure req object
      /**
       * Function To get admin user info
       */
      const userInfo = await AdminHelper.getAdminInfo({
        username,
        password,
      });
      console.log('userInfo', userInfo);
      if (userInfo.error) {
        return SetResponse.error(res, RESPONSES.BADREQUEST, {
          message: userInfo.message,
          error: userInfo.error,
        });
      }
      const userId = userInfo.data.adminId;
      const roleId = userInfo.data.roleId;
      const is_email_2FA = userInfo.data.is_email_2FA;
      const is_2FA = userInfo.data.is_2FA;
      /**
       * function to generate jwt Token using admin user id
       */
      const token = await TokenHandler.generateToken(userId.toString());
      const filePath = `${process.cwd()}/server/api/middlewares/emailTemplate/verifyPhotographer.ejs`;
      const code: any = Math.floor(1000 + Math.random() * 9000);
      console.log('code:::', code);
      const details: any = {
        fullname: userInfo?.data?.username,
        supportEmail: process.env.CONTACT_US_EMAIL,
        site_url: process.env.SITE_URL,
        // isVerified: updatemeta.status === 'APPROVED' ? 1 : 0,
        code: code,
      };
      const htmlDetails = await ejs.renderFile(filePath, details, {
        async: true,
      });
      console.log('htmlDetails:::', htmlDetails);
      const mailOptions = {
        from: `${process.env.FROM_WEBSITE_NAME} <${process.env.FROM_EMAIL_ADDRESS}>`, // sender address
        to: `${userInfo?.data?.username} <${userInfo?.data?.username}>`, // list of receivers
        subject: 'Welcome to Fanverse', // Subject line
        html: htmlDetails,
      };
      const mailResponse: any = await transporter.sendMail(mailOptions);
      console.log('mailResponse:::', mailResponse);
      const updateUserEmail2faCode = await AdminUsersModel.update(
        { email_2FA_code: code },
        { where: { adminId: userId } }
      );
      console.log('updateUserEmail2faCode:::', updateUserEmail2faCode);
      return SetResponse.success(res, RESPONSES.SUCCESS, {
        message: MESSAGES.ADMIN.SUCCESS,
        error: false,
        data: {
          accessToken: token.data,
          refreshToken: token.data,
          userId,
          roleId,
          is_email_2FA,
          is_2FA,
        },
      });
    } catch (error: any) {
      console.log('admin login error:: ', error);
      return SetResponse.error(res, error.status | 400, {
        message: error.message,
        error: true,
      });
    }
  };
  /**
   * Api
   * @param req
   * @param res
   * @returns
   */
  usersList = async (
    req: Request,
    res: Response
  ): Promise<Interfaces.PromiseResponse> => { 
    try {
      const { username, password } = req.body; // destructure body data
      /**
       * function to get admin user info
       */
      const userInfo = await AdminHelper.getAdminInfo({
        username,
        password,
      });

      if (userInfo.error) {
        return SetResponse.error(res, RESPONSES.BADREQUEST, {
          message: userInfo.message,
          error: userInfo.error,
        });
      }
      const userId = userInfo.data.adminId; // seting admin id in userId key

      /**
       * Generating fresh access token for auth
       */

      const token = await TokenHandler.generateToken(userId.toString());
      return SetResponse.success(res, RESPONSES.SUCCESS, {
        message: MESSAGES.ADMIN.SUCCESS,
        error: false,
        data: {
          accessToken: token.data,
          refreshToken: token.data,
          userId,
        },
      });
    } catch (error: any) {
      console.log('admin login error:: ', error);
      return SetResponse.error(res, error.status | 400, {
        message: error.message,
        error: true,
      });
    }
  };
  /**
   * API to get admin panel deshboard data
   * @param req
   * @param res
   * @returns{}
   */
  graph = async (
    req: Request,
    res: Response
  ): Promise<Interfaces.PromiseResponse> => {
    try {
      let sortBy = req.query.sortBy;
      // GRPC call to get graph data from nft service
      const graphRes: any = await new Promise((resolve, reject) => {
        nftClient.GetDashBoard({ sortBy }, (err: any, response: any) => {
          if (err) {
            return reject(err);
          }
          return resolve(response);
        });
      });
      console.log('response data :::: ', graphRes);
      if (graphRes.error) {
        throw graphRes;
      }
      console.log('graphRes', graphRes.dashBoardAmount.weekData);

      return SetResponse.success(res, RESPONSES.SUCCESS, graphRes);
    } catch (error: any) {
      console.log('admin login error:: ', error);
      return SetResponse.error(res, error.status | 400, {
        message: error.message,
        error: true,
      });
    }
  };
  /**
   * Api to get All feature Creator
   * @param _req
   * @param res
   * @returns
   */

  featuredAllCreator = async (_req: Request, res: Response): Promise<any> => {
    try {
      const limit = 8;
      const offset = 1;
      /**
       * GRPC call to get feature Creator data from user services
       */
      const CreatorRes: any = await new Promise((resolve, reject) =>
        userClient.GetAllFeaturedCreator(
          { limit, offset },
          (err: any, response: any) => {
            if (err) {
              return reject(err);
            }
            return resolve(response);
          }
        )
      );

      return SetResponse.success(res, RESPONSES.SUCCESS, {
        message: CreatorRes.message,
        error: CreatorRes.error,
        data: CreatorRes.rows,
        count: CreatorRes.count,
      });
    } catch (error: any) {
      console.log('error', error);
      return SetResponse.success(res, RESPONSES.SUCCESS, {
        message: error.message,
        error: true,
      });
    }
  };

  /* 
    create admint wallet address
  */
  createWallet = async (
    req: Request,
    res: Response
  ): Promise<Interfaces.PromiseResponse> => {
    try {
      const { address }: any = req.body;
      const adminId: any = req?.userId as string;
      const wallet: any = await AdminHelper.createWalletForAdmin(
        adminId,
        address
      );
      if (!!wallet.error === true) {
        throw wallet;
      }
      console.log('wallet : createWallet : ', wallet);
      return SetResponse.success(res, RESPONSES.SUCCESS, wallet);
    } catch (error: any) {
      console.log('admin : createWallet:: ', error);
      return SetResponse.error(res, error.status | 400, {
        message: error.message,
        error: true,
      });
    }
  };
  getWallet = async (
    req: Request,
    res: Response
  ): Promise<Interfaces.PromiseResponse> => {
    try {
      // let { address } :any = req.body;
      const adminId: any = req?.userId as string;
      const wallet: any = await AdminHelper.checkAdminById(adminId);
      if (!!wallet.error === true) {
        throw wallet;
      }
      console.log('wallet : createWallet : ', wallet);
      let walletAddress: any = wallet.data.walletAddress;
      return SetResponse.success(res, RESPONSES.SUCCESS, {
        error: false,
        message: MESSAGES.ADMIN.WALLET,
        data: {
          adminId: adminId,
          walletAddress: walletAddress,
        },
      });
    } catch (error: any) {
      console.log('admin : createWallet:: ', error);
      return SetResponse.error(res, error.status | 400, {
        message: error.message,
        error: true,
      });
    }
  };

  /**
   * function to create admin and sub_admin
   * @param req username, password, walletAddress, roleId
   * @param res
   * @returns
   */
  adminRegister = async (
    req: Request,
    res: Response
  ): Promise<Interfaces.PromiseResponse> => {
    try {
      const { username, password, walletAddress, roleId } = req.body; // destructue req body
      const payload: any = {
        username,
        password,
        walletAddress,
        roleId,
      };
      // checking if already email is exists
      const isEmailExits = await AdminHelper.getEmail(username);
      console.log('isEmailExitsisEmailExits', isEmailExits);

      if (!!isEmailExits && !!isEmailExits.error) {
        throw { message: isEmailExits.message };
      }
      const ownerCheck = await AdminHelper.AdminRoleCheck(roleId);
      console.log('ownerCheckownerCheckownerCheck', ownerCheck);

      if (!!ownerCheck && !!ownerCheck.error) {
        throw { message: ownerCheck.message };
      }

      const createAdminRegister: any = await AdminHelper.createAdminRegister(
        payload
      );
      console.log('createAdminRegister', createAdminRegister);

      return SetResponse.success(res, RESPONSES.SUCCESS, {
        message: MESSAGES.ADMIN.REGISTER,
        error: false,
      });
    } catch (error: any) {
      console.log('adminRegister error: ', error);
      return SetResponse.error(res, error.status | RESPONSES.BADREQUEST, {
        message: error.message,
        error: true,
      });
    }
  };

  /**
   * function to create admin & sub_admin role
   * @param req role
   * @param res
   * @returns
   */
  createAdminRoleType = async (
    req: Request,
    res: Response
  ): Promise<Interfaces.PromiseResponse> => {
    try {
      const { role } = req.body; // destructue req body
      const payload: any = {
        role,
      };
      const isRoleExits = await AdminHelper.getRole(role);
      console.log('isRoleExitsisRoleExits', isRoleExits);

      if (isRoleExits.data.length > 0) {
        throw { message: MESSAGES.ADMIN.ROLE_EXITS };
      }

      const createAdminRoleType: any = await AdminHelper.createAdminRoleType(
        payload
      );
      console.log('createAdminRoleType', createAdminRoleType);

      if (createAdminRoleType.error) {
        throw { message: createAdminRoleType.message };
      }

      return SetResponse.success(res, RESPONSES.SUCCESS, {
        message: MESSAGES.ADMIN.ROLE,
        error: false,
      });
    } catch (error: any) {
      console.log('createAdminRoleType error: ', error);
      return SetResponse.error(res, error.status | RESPONSES.BADREQUEST, {
        message: error.message,
        error: true,
      });
    }
  };
}
export default new Controller();

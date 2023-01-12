const speakeasy = require('speakeasy');
import QRCode from 'qrcode';
import nodeMailer from 'nodemailer';
import TokenHandler from '../../middlewares/jwt.helper';
import RedisHelper from '../../helpers/redis.helper';
import Users2FAModel from '../../models/Users2FA.model';
import AdminUsersModel from '../../models/adminUsers.model';
import SetResponse from '../../response/response.helper';
import { v4 as uuidV4 } from 'uuid';
import { MESSAGES } from '../../constant/response.messages';
import { Request, Response } from 'express';
import { RESPONSES } from '../../constant/response';
import l from '../../../common/logger';
import { object } from 'joi';
import { cat } from 'shelljs';
const ejs = require('ejs');
// import UsersModel from '../../models/Users.model';

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
  getUser = async (req: Request, res: Response) => {
    // const userId = req.body.userId
    try {
      const userId = req.userId as string;
      const authType = req.body.authType;
      const response = await this.generate2FA(userId, authType);
      return SetResponse.success(res, RESPONSES.SUCCESS, {
        message: '2FA response.',
        error: false,
        data: response,
      });
    } catch (error: any) {
      l.error('Error generate2FA', error.message);
      return SetResponse.error(res, RESPONSES.BADREQUEST, {
        message: error.message,
        error: true,
      });
    }
  };
  /**
   * Generate 2FA token for user
   * @param param
   * @returns
   */
  async generate2FA(userId: any = '', authType: any) {
    try {
      console.log('userId:::::>>>', userId);
      if (authType === 'email') {
        const userDetailsRes = (await AdminUsersModel.findOne({
          where: {
            adminId: userId,
          },
          raw: true,
        })) as any;
        console.log('userDetailsRes:::', userDetailsRes);

        const filePath = `${process.cwd()}/server/api/middlewares/emailTemplate/verifyPhotographer.ejs`;
        // const code = Math.floor(Math.random() * (99 - 1 + 1)) + 1;
        const code: any = Math.floor(1000 + Math.random() * 9000);
        console.log('code:::', code);
        const details: any = {
          fullname: userDetailsRes?.username,
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
          to: `${userDetailsRes?.username} <${userDetailsRes?.username}>`, // list of receivers
          subject: 'Welcome to Fanverse', // Subject line
          html: htmlDetails,
        };
        const mailResponse: any = await transporter.sendMail(mailOptions);
        console.log('mailResponse:::', mailResponse);
        if (mailResponse.accepted.length > 0) {
          console.log('inside emai sucess');
          const updateUserEmail2faCode = await AdminUsersModel.update(
            { email_2FA_code: code },
            { where: { adminId: userId } }
          );
          console.log('updateUserEmail2faCode:::', updateUserEmail2faCode);
          return { message: MESSAGES.USER.success };
        } else {
          console.log('inside email faile');
          return { message: MESSAGES.USER.failure };
        }
      } else {
        const returnObj = {
          is_enabled: false,
          secret: '',
          qr: '',
          token: '',
        } as any;

        if (!!userId === false) throw new Error('User id is required !');
        const userSecretObj = (await Users2FAModel.findOne({
          where: {
            userId: userId,
          },
          raw: true,
        })) as any;

        if (!!userSecretObj === false)
          await this.generate2FASecret(userId, returnObj);
        else {
          const isEnabled = !!userSecretObj.is_enabled ?? false;
          returnObj.secret = !!isEnabled === false ? userSecretObj.secret : '';
          returnObj.qr = !!isEnabled === false ? userSecretObj.qrCodeUrl : '';
          returnObj.is_enabled = isEnabled;
          returnObj.token = userSecretObj.temp_token;
        }

        return returnObj;
      }
    } catch (err) {
      console.log('generate2FA err', err);
    }
  }

  /**
   * Generates and saves user 2FA secret
   * @param userId
   * @param returnObj
   */
  private async generate2FASecret(userId = '', returnObj = {} as any) {
    if (!!userId === false) throw new Error('User not found !');

    const secretObj = speakeasy.generateSecret();
    const userSecret = secretObj.base32;
    console.log('SECRET OBJ: ', secretObj);
    // const userInfo: any = await UsersModel.findOne({
    //   where: { userId: userId },
    //   raw: true,
    // });
    // console.log('userInfo ::: ', userInfo);
    // const qrCode = secretObj.otpauth_url;
    const qrCode = await speakeasy.otpauthURL({
      secret: secretObj.ascii,
      label: `Fanverse Admin`,
    });
    console.log('QR CODE DATA: ', qrCode);
    const tempToken = uuidV4();
    const qrCodeUrl = await QRCode.toDataURL(qrCode.toString());
    await Users2FAModel.create({
      userId: userId,
      secret: userSecret,
      is_2fa: false,
      qrCodeUrl: qrCodeUrl,
      temp_token: tempToken,
    });
    returnObj.secret = userSecret;
    returnObj.is_enabled = false;
    returnObj.qr = qrCodeUrl;
    returnObj.token = tempToken;
  }

  /**
   * Verify 2FA user code
   * @param reqBody
   */
  verifyUser = async (req: Request, res: Response) => {
    try {
      console.log({ reqBody: req.body });
      const { code = '', type = '', authType = '' } = req.body;
      if (authType == 'email') {
        const adminUserDetails: any = await AdminUsersModel.findOne({
          where: { adminId: req.userId, email_2FA_code: code },
          raw: true,
        });
        console.log('adminUserDetails:::', adminUserDetails);
        if (adminUserDetails != null) {
          await AdminUsersModel.update(
            { is_email_2FA: 1 },
            { where: { adminId: req.userId } }
          );
          const jwtToken = await TokenHandler.generateToken(req.userId ?? '');
          await RedisHelper.setString(
            `jwt_token_${req.userId}`,
            jwtToken.data.toString()
          );
          return SetResponse.success(res, RESPONSES.SUCCESS, {
            message: '2FA verifyResposnse.',
            error: false,
            data: {
              accessToken: jwtToken?.data,
              userId: req.userId,
            },
          });
        } else {
          return SetResponse.error(res, RESPONSES.BADREQUEST, {
            message: 'Please Provide a Valid code .',
            error: true,
          });
        }
      } else {
        if (!!type === false) {
          // If no type then just verify 2fa
          const user2fa: any = await Users2FAModel.findOne({
            where: { userId: req.userId },
            raw: true,
          });
          const response = await this.verify2FA({
            code: code,
            token: user2fa.temp_token,
          });
          if (response.error) {
            throw new Error(response.message);
          }
          return SetResponse.success(res, RESPONSES.SUCCESS, {
            message: '2FA verifyResposnse.',
            error: false,
            data: response.data,
          });
        } else {
          const jwtToken = await TokenHandler.generateToken(req.userId ?? '');
          await RedisHelper.setString(
            `jwt_token_${req.userId}`,
            jwtToken.data.toString()
          );
          return SetResponse.success(res, RESPONSES.SUCCESS, {
            message: '2FA verifyResposnse.',
            error: false,
            data: {
              accessToken: jwtToken,
              userId: req.userId,
            },
          });
        }
      }
    } catch (error: any) {
      return SetResponse.error(res, RESPONSES.BADREQUEST, {
        message: error.message,
        error: false,
      });
    }
  };
  /**
   * Verify 2FA Or email after login
   * @param reqBody
   */
  loginVerifyUser = async (req: Request, res: Response) => {
    try {
      console.log({ reqBody: req.body });
      const { code = '', type = '', authType = '', userId = '' } = req.body;
      if (authType == 'email') {
        const adminUserDetails: any = await AdminUsersModel.findOne({
          where: { adminId: userId, email_2FA_code: code },
          raw: true,
        });
        console.log('adminUserDetails:::', adminUserDetails);
        if (adminUserDetails != null) {
          const jwtToken = await TokenHandler.generateToken(userId ?? '');
          await RedisHelper.setString(
            `jwt_token_${userId}`,
            jwtToken.data.toString()
          );
          return SetResponse.success(res, RESPONSES.SUCCESS, {
            message: '2FA verifyResposnse.',
            error: false,
            data: {
              accessToken: jwtToken?.data,
              userId: userId,
              is_email_2FA: adminUserDetails?.is_email_2FA == 1 ? true : false,
              is_2FA: adminUserDetails?.is_2FA == 1 ? true : false,
            },
          });
        } else {
          // return SetResponse.success(res, RESPONSES.SUCCESS, {
          //   message: 'Please Provide a Valid code .',
          //   error: true,
          // });true

          return SetResponse.error(res, RESPONSES.BADREQUEST, {
            message: 'Please Provide a Valid code .',
            error: true,
          });
        }
      } else {
        // if (!!type === false) {
        // If no type then just verify 2fa
        const adminUserDetails: any = await AdminUsersModel.findOne({
          where: { adminId: userId },
          raw: true,
        });
        // console.log('adminUserDetails:::', adminUserDetails);
        console.log('adminUserDetails:::', adminUserDetails);
        const user2fa: any = await Users2FAModel.findOne({
          where: { userId: userId },
          raw: true,
        });
        const response = await this.verifyLogin2FA({
          code: code,
          token: user2fa.temp_token,
        });
        if (response.error) {
          throw new Error(response.message);
        }
        return SetResponse.success(res, RESPONSES.SUCCESS, {
          message: '2FA verifyResposnse.',
          error: false,
          data: {
            ...response.data,
            is_email_2FA: adminUserDetails?.is_email_2FA == 1 ? true : false,
            is_2FA: adminUserDetails?.is_2FA == 1 ? true : false,
          },
        });
        // }
        //  else {
        //   const jwtToken = await TokenHandler.generateToken(req.userId ?? '');
        //   await RedisHelper.setString(
        //     `jwt_token_${req.userId}`,
        //     jwtToken.data.toString()
        //   );
        //   return SetResponse.success(res, RESPONSES.SUCCESS, {
        //     message: '2FA verifyResposnse.',
        //     error: false,
        //     data: {
        //       accessToken: jwtToken,
        //       userId: req.userId,
        //     },
        //   });
        // }
      }
    } catch (error: any) {
      return SetResponse.error(res, RESPONSES.BADREQUEST, {
        message: error.message,
        error: false,
      });
    }
  };
  async verify2FA(reqBody = {} as any) {
    try {
      console.log({ reqBody });
      const code = reqBody.code || null;
      const token = reqBody.token || null;

      // if (!!userId === false) throw new Error('User not found !');
      if (!!token === false) throw new Error('Token not provided !');
      if (!!code === false) throw new Error('Code not provided !');
      const userInfo = (await Users2FAModel.findOne({
        where: {
          temp_token: token,
        },
        raw: true,
      })) as any;

      if (!!userInfo === false) throw new Error('2FA failed !');
      const verified = speakeasy.totp.verify({
        secret: userInfo.secret,
        encoding: 'base32',
        token: code,
      });
      console.log('verified :::: ', verified);
      if (!!verified === false) throw new Error('Provided code is invalid !');
      const userId = userInfo.userId;
      await Users2FAModel.update(
        // {
        //   is_2fa: true,
        // },
        {
          is_enabled: true,
        },
        {
          where: {
            userId,
          },
        }
      );

      await AdminUsersModel.update(
        { is_2FA: 1 },
        { where: { adminId: userId } }
      );

      const jwtToken = await TokenHandler.generateToken(userId.toString());
      await RedisHelper.setString(
        `jwt_token_${userId}`,
        jwtToken.data.toString()
      );

      return {
        error: false,
        data: {
          accessToken: jwtToken.data,
          refreshToken: jwtToken.data,
          userId,
        },
      };
    } catch (error: any) {
      return {
        message: error.message,
        error: true,
      };
    }
  }
  async verifyLogin2FA(reqBody = {} as any) {
    try {
      console.log({ reqBody });
      const code = reqBody.code || null;
      const token = reqBody.token || null;

      // if (!!userId === false) throw new Error('User not found !');
      if (!!token === false) throw new Error('Token not provided !');
      if (!!code === false) throw new Error('Code not provided !');
      const userInfo = (await Users2FAModel.findOne({
        where: {
          temp_token: token,
        },
        raw: true,
      })) as any;

      if (!!userInfo === false) throw new Error('2FA failed !');
      const verified = speakeasy.totp.verify({
        secret: userInfo.secret,
        encoding: 'base32',
        token: code,
      });
      console.log('verified :::: ', verified);
      if (!!verified === false) throw new Error('Provided code is invalid !');
      const userId = userInfo.userId;
      // await Users2FAModel.update(
      //   // {
      //   //   is_2fa: true,
      //   // },
      //   {
      //     is_enabled: true,
      //   },
      //   {
      //     where: {
      //       userId,
      //     },
      //   }
      // );

      // await AdminUsersModel.update(
      //   { is_2FA: 1 },
      //   { where: { adminId: userId } }
      // );

      const jwtToken = await TokenHandler.generateToken(userId.toString());
      await RedisHelper.setString(
        `jwt_token_${userId}`,
        jwtToken.data.toString()
      );

      return {
        error: false,
        data: {
          accessToken: jwtToken.data,
          refreshToken: jwtToken.data,
          userId,
        },
      };
    } catch (error: any) {
      return {
        message: error.message,
        error: true,
      };
    }
  }
  // disableStatus = async (req: Request, res: Response) => {
  //   try {
  //     const userId = req.userId;
  //     const { isActive, code, authType } = req.body;
  //     if (authType == 'email') {
  //       if (isActive === true) {
  //         const adminUserDetails: any = await AdminUsersModel.findOne({
  //           where: { adminId: userId, email_2FA_code: code },
  //           raw: true,
  //         });
  //       console.log('adminUserDetails:::', adminUserDetails);
  //       }

  //       if (adminUserDetails != null) {

  //         } else {
  //         }

  //         return SetResponse.success(res, RESPONSES.SUCCESS, {
  //           message: 'Update 2FA successfully .',
  //           error: false,
  //         });
  //       } else {
  //         return SetResponse.error(res, RESPONSES.BADREQUEST, {
  //           message: 'Please Provide a Valid code .',
  //           error: true,
  //         });
  //       }
  //     } else {
  //       const check2Fa: any = await Users2FAModel.findOne({
  //         where: {
  //           userId: userId,
  //         },
  //         raw: true,
  //       });
  //       // console.log('check2Fa:::', check2Fa);
  //       let response: any;
  //       if (!!check2Fa === false && check2Fa === null) {
  //         throw new Error('User is not valid 2FA.');
  //         // response = await this.generate2FA({ userId })
  //       }
  //       if (!code && isActive === true) {
  //         throw new Error('Your code is not provided.');
  //       }
  //       if (isActive === true) {
  //         const userInfo = (await Users2FAModel.findOne({
  //           where: {
  //             temp_token: check2Fa.temp_token,
  //           },
  //           raw: true,
  //         })) as any;

  //         if (!!userInfo === false) throw new Error('2FA failed !');
  //         const verified = speakeasy.totp.verify({
  //           secret: userInfo.secret,
  //           encoding: 'base32',
  //           token: code,
  //         });
  //         console.log('verified :::: ', verified);
  //         if (!!verified === false)
  //           throw new Error('Provided code is invalid !');
  //       }
  //       await Users2FAModel.update(
  //         {
  //           is_enabled: isActive,
  //         },
  //         {
  //           where: {
  //             userId: userId,
  //           },
  //         }
  //       );
  //       await AdminUsersModel.update(
  //         {
  //           is_2FA: isActive,
  //         },
  //         {
  //           where: {
  //             adminId: userId,
  //           },
  //         }
  //       );
  //       return SetResponse.success(res, RESPONSES.SUCCESS, {
  //         message: 'Update 2FA successfully',
  //         error: false,
  //         isActive: isActive,
  //         data: response,
  //       });
  //     }
  //   } catch (error: any) {
  //     l.error('Error enableDisableStatus...');
  //     return SetResponse.error(res, RESPONSES.BADREQUEST, {
  //       message: error.message,
  //       error: true,
  //     });
  //   }
  // };
  checkStatus = async (req: Request, res: Response) => {
    try {
      const userId = req.userId;
      const two_faResponse: any = await AdminUsersModel.findOne({
        where: {
          adminId: userId,
        },
        attributes: ['is_2FA', 'is_email_2FA'],
        raw: true,
      });
      l.info(two_faResponse, 'two_faResponse :::: ');
      // const checkPassword: any = await UsersModel.findOne({
      //   where: {
      //     userId: userId,
      //     password: null,
      //   },
      //   attributes: ['userId'],
      //   raw: true,
      // });
      // l.info(checkPassword, 'checkPassword checkPassword ');
      // let socialLogin: boolean = false;
      // if (checkPassword) {
      //   socialLogin = true;
      // }

      if (two_faResponse != null) {
        l.info('user2FA data:', two_faResponse);
        return SetResponse.success(res, RESPONSES.SUCCESS, {
          message: '2fa Enabled',
          error: false,
          data: two_faResponse,
          // socialLogin,
        });
      }
      return SetResponse.success(res, RESPONSES.SUCCESS, {
        message: '2fa Disabled',
        error: false,
        data: { is_enabled: 0 },
        // socialLogin,
      });
    } catch (error: any) {
      l.error('Error checkStatus...');
      return SetResponse.error(res, RESPONSES.BADREQUEST, {
        message: error.message,
        error: true,
      });
    }
  };

  disableStatus = async (req: Request, res: Response) => {
    try {
      const userId = req.userId;
      const { authType } = req.body;
      if (authType == 'email') {
        await AdminUsersModel.update(
          {
            is_email_2FA: 0,
          },
          {
            where: {
              adminId: userId,
            },
          }
        );
        return SetResponse.success(res, RESPONSES.SUCCESS, {
          message: 'Update 2FA successfully .',
          error: false,
        });
      } else {
        await Users2FAModel.update(
          {
            is_enabled: 0,
          },
          {
            where: {
              userId: userId,
            },
          }
        );
        await AdminUsersModel.update(
          {
            is_2FA: 0,
          },
          {
            where: {
              adminId: userId,
            },
          }
        );
        return SetResponse.success(res, RESPONSES.SUCCESS, {
          message: 'Update 2FA successfully',
          error: false,
        });
      }
    } catch (error: any) {
      l.error('Error enableDisableStatus...');
      return SetResponse.error(res, RESPONSES.BADREQUEST, {
        message: error.message,
        error: true,
      });
    }
  };
}
export default new Controller();

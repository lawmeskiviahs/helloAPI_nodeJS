/* eslint-disable prettier/prettier */
import { Request, Response } from 'express';
import * as Interfaces from '../../interfaces';
import { RESPONSES } from '../../constant/response';
import SetResponse from '../../response/response.helper';
import ShaivikHelper from '../../helpers/shaivik.helper'

export class Controller {
    userPost = async (
        req: Request,
        res: Response
      ): Promise<Interfaces.PromiseResponse> => {
        try {
          const { name, age, grade, email, phone } = req.body; // destructue req body
          const payload: any = {
            name,
            age,
            grade,
            email,
            phone
          };

          const createUserDetils: any = await ShaivikHelper.createUserDetils(
            payload
          );
          console.log('createUserDetils', createUserDetils);
    
          return SetResponse.success(res, RESPONSES.SUCCESS, {
            message: 'user data created',
            error: false,
          });
        } catch (error: any) {
          console.log('userData error: ', error);
          return SetResponse.error(res, error.status | RESPONSES.BADREQUEST, {
            message: error.message,
            error: true,
          });
        }
      };

      userGet = async (
        req: Request,
        res: Response,
      ): Promise<Interfaces.PromiseResponse> => {
        try{
            const name = req.params.id;
            const userInfo = await ShaivikHelper.getUserDetails({
              name
            });

            const userData = userInfo.data;

          return SetResponse.success(res, RESPONSES.SUCCESS, {
            message: 'User details found',
            error: false,
            data: {
              userData,
            },
          });
        }
        catch (error: any) {
          console.log('user find error:: ', error);
          return SetResponse.error(res, error.status | 400, {
            message: error.message,
            error: true,
          });
        }
      }

      userUpdate = async (
        req: Request,
        res: Response
      ): Promise<Interfaces.PromiseResponse> => {
        try {
          const name = req.params.id; // destructue req body
          const {age, grade} = req.body;
          const updateUserDetails: any = await ShaivikHelper.updateUserDetails(
            {name, age, grade}
          );
          console.log('updateUserDetails', updateUserDetails);
    
          return SetResponse.success(res, RESPONSES.SUCCESS, {
            message: 'User Updated Successfully',
            error: false,
          });
        } catch (error: any) {
          console.log('userUpdate error: ', error);
          return SetResponse.error(res, error.status | RESPONSES.BADREQUEST, {
            message: error.message,
            error: true,
          });
        }
      };
}
export default new Controller();
/* eslint-disable prettier/prettier */
// import internal from 'stream';
import sequelize from '../db/connection';
import ShaivikRoleModel from '../models/shaivik.model';

class ShaivikHelper {
    constructor() {
      //
    }
    public async createUserDetils(payload: any) {
        try {
          const registerPayload = {
            name: payload.name,
            age: payload.age,
            grade: payload.grade,
            email: payload.email,
            phone: payload.phone
          };
          console.log(registerPayload, 'registerPayload');
    
          const data = await sequelize.transaction(async (t: any) => {
            const responseData = await ShaivikRoleModel.create(registerPayload, {
              transaction: t,
            });
            return responseData;
          });
          return data;
        } catch (err: any) {
          console.log('err: ', err);
          return {
            error: true,
            message: err.message,
          };
        }
      }

      public async getUserDetails({
        name,
      }: {
        name: string;
      }) {
        try {
          /**
           * Query to get admin user detail by name
           */
          const userInfo: any = await ShaivikRoleModel.findOne({
            where: {
              name,
            },
          });
          if (!userInfo) {
            throw { message: 'User not found' };
          }
          return {
            message: 'User found success',
            data: userInfo.dataValues,
            error: false,
            status: 200,
          };
        } catch (err: any) {
          return {
            message: err.message,
            error: true,
            status: err.status ? err.status : 400,
          };
        }
      }

      public async updateUserDetails({
        name,
        age,
        grade,
      }: {
        name: string;
        age: number;
        grade: number;
      }) {
        try {
          /**
           * Query to get admin user detail by name
           */
          // const result = {age, grade}
          const userInfo: any = await ShaivikRoleModel.findOne({
            where: {
              name,
            },
          });
          if (!userInfo) {
            throw { message: 'User not found' };
          }
          const updatedEmployee = await ShaivikRoleModel.update({
            age:age,grade:grade
          }, {
            where : {
              name
            }
          });
          return {
            message: 'User update success',
            data: updatedEmployee,
            error: false,
            status: 200,
          };
        } catch (err: any) {
          return {
            message: err.message,
            error: true,
            status: err.status ? err.status : 400,
          };
        }
      }

}
export default new ShaivikHelper();
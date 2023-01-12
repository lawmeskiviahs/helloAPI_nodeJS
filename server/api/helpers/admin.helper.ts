/* eslint-disable prettier/prettier */
import AdminModel from '../models/adminUsers.model';
import bcrypt from 'bcrypt';
import NFTFees from '../models/nft.fees.model';
import TransactionFees from '../models/transactionFees.model';
import { MESSAGES } from '../constant/response.messages';
import AdminUsersModel from '../models/adminUsers.model';
import sequelize from '../db/connection';
import { ADMIN_ROLE } from '../constant/nftFee_type.enum';
import AdminRoleModel from '../models/adminRole.model';
import CONFIG from '../config';

class USERHelper {
  constructor() {
    //
  }

  public async getAdminInfo({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) {
    try {
      /**
       * Query to get admin user detail by name
       */
      const adminInfo: any = await AdminModel.findOne({
        where: {
          username,
        },
      });
      if (!adminInfo || !adminInfo.dataValues) {
        throw { message: 'User not found' };
      }
      /**
       * Validating password using bcrypt
       */
      const validPassword = await bcrypt.compare(
        password,
        adminInfo.dataValues.password
      );

      if (!validPassword)
        throw {
          message: 'Wrong password',
        };

      return {
        message: 'User found success',
        data: adminInfo.dataValues,
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

  /**
   * function for save nft fees
   * @param req limit,offset
   * @param res
   * @returns <{message, error}>
   */
  public async nftFeesSave(data: any) {
    try {
      console.log('data :: ', data);
      const nftFeesSave = await NFTFees.create(data);
      if (nftFeesSave) {
        return nftFeesSave;
      }
      return null;
    } catch (err: any) {
      return {
        message: err.message,
        error: true,
        status: err.status ? err.status : 400,
      };
    }
  }

  /**
   * function for save nft transction feeas
   * @param req
   * @param res
   * @returns <{message, error}>
   */
  public async nftTransactionFeesSave(data: any) {
    try {
      console.log('data :: ', data);
      const nftFeesSave = await TransactionFees.create(data);
      if (nftFeesSave) {
        return nftFeesSave;
      }
      return null;
    } catch (err: any) {
      return {
        message: err.message,
        error: true,
        status: err.status ? err.status : 400,
      };
    }
  }

  /**
   * function for check transaction fees by id
   * @param req
   * @param res
   * @returns
   */
  public async TransactionFeesCheckById(id: any) {
    const nftResponse = await TransactionFees.findOne({
      where: {
        id: id,
      },
    });
    if (nftResponse) {
      return nftResponse;
    } else return null;
  }

  /**
   * function for update transctions fees
   * @param req
   * @param res
   * @returns <{message, error}>
   */
  public async updateTransactionFees(data: any, id: any) {
    const nftResponse = await TransactionFees.update(data, {
      where: {
        id: id,
      },
    });
    if (nftResponse) {
      return nftResponse;
    } else {
      return null;
    }
  }

  /**
   * function for check nft fees by id
   * @param req
   * @param res
   * @returns
   */
  public async nftFeesCheckById(id: any) {
    const nftResponse = await NFTFees.findOne({
      where: {
        nft_fees_id: id,
      },
    });
    if (nftResponse) {
      return nftResponse;
    } else return null;
  }

  /**
   * function for update nft fees
   * @param req
   * @param res
   * @returns <{message, error}>
   */
  public async updateNftFees(data: any, id: any) {
    const nftResponse = await NFTFees.update(data, {
      where: {
        nft_fees_id: id,
      },
    });
    if (nftResponse) {
      return nftResponse;
    } else {
      return null;
    }
  }

  /**
   * function for get transction fees list
   * @param req
   * @param res
   * @returns
   */
  public async getTransactionFeesList(limit: number, offset: number) {
    try {
      let data: any;
      if (limit > -1) {
        if (offset < 1) {
          offset = 1;
        }
        offset = (offset - 1) * limit;
        data = await TransactionFees.findAndCountAll({
          attributes: ['id', 'fees', 'types', 'is_active'],
          limit,
          offset,
          raw: true,
        });
      } else {
        data = await TransactionFees.findAndCountAll({
          attributes: ['id', 'fees', 'types', 'is_active'],
          raw: true,
        });
      }
      if (data) {
        return data;
      } else {
        return null;
      }
    } catch (err: any) {
      return {
        message: err.message,
        error: true,
        status: err.status ? err.status : 400,
      };
    }
  }

  /**
   * function for get nft fees list
   * @param req
   * @param res
   * @returns
   */
  public async getNftFeesList(limit: number, offset: number) {
    try {
      let data: any;
      if (limit > -1) {
        if (offset < 1) {
          offset = 1;
        }
        offset = (offset - 1) * limit;
        data = await NFTFees.findAndCountAll({
          attributes: ['nft_fees_id', 'fees', 'types', 'is_active'],
          limit,
          offset,
          raw: true,
        });
      } else {
        data = await NFTFees.findAndCountAll({
          attributes: ['nft_fees_id', 'fees', 'types', 'is_active'],
          raw: true,
        });
      }
      if (data) {
        return data;
      } else {
        return null;
      }
    } catch (err: any) {
      return {
        message: err.message,
        error: true,
        status: err.status ? err.status : 400,
      };
    }
  }

  /**
   * function for get type by nft
   * @param req
   * @param res
   * @returns
   */
  public async getTypeByType(type: any) {
    try {
      const nftFeesResp = await NFTFees.findOne({
        where: {
          types: type,
        },
      });
      if (nftFeesResp) {
        return nftFeesResp;
      } else {
        return null;
      }
    } catch (err: any) {
      return {
        message: err.message,
        error: true,
        status: err.status ? err.status : 400,
      };
    }
  }
  /**
   * Funtion to Get Nft Fees From nft_fees table.
   * @returns
   */
  public async nftFeesDetail() {
    try {
      const nftFeesResp = await NFTFees.findOne({
        attributes: ['nft_fees_id', 'fees', 'types', 'is_active'],
      });
      console.log('nftFeesResp:::', nftFeesResp);
      if (nftFeesResp) {
        return nftFeesResp;
      } else {
        return null;
      }
    } catch (err: any) {
      return {
        message: err.message,
        error: true,
        status: err.status ? err.status : 400,
      };
    }
  }

  /**
   * function for get fees and type
   * @param req
   * @param res
   * @returns
   */
  public async getFeeNType() {
    try {
      const nftFeesResp = await NFTFees.findOne({ raw: true });
      console.log({ nftFeesResp });
      if (nftFeesResp) {
        return nftFeesResp;
      } else {
        return null;
      }
    } catch (err: any) {
      return {
        message: err.message,
        error: true,
        status: err.status ? err.status : 400,
      };
    }
  }

  /**
   * function for get transction feeas
   * @param req
   * @param res
   * @returns <{message, error}>
   */
  public async getTransactionFees() {
    try {
      const nftFeesResp = await TransactionFees.findOne({
        attributes: ['fees', 'types'],
        raw: true,
      });
      console.log({ nftFeesResp });
      if (nftFeesResp) {
        return nftFeesResp;
      } else {
        return null;
      }
    } catch (err: any) {
      return {
        message: err.message,
        error: true,
        status: err.status ? err.status : 400,
      };
    }
  }
  /**
   * Funtion to Get transaction fees.
   * @returns
   */
  public async transactionFeesDetail() {
    try {
      const nftFeesResp = await TransactionFees.findOne({
        attributes: ['id', 'fees', 'types', 'is_active'],
      });
      console.log('TransactionFees:::', nftFeesResp);
      if (nftFeesResp) {
        return nftFeesResp;
      } else {
        return null;
      }
    } catch (err: any) {
      return {
        message: err.message,
        error: true,
        status: err.status ? err.status : 400,
      };
    }
  }

  /**
   * function for check admin by id
   * @param req
   * @param res
   * @returns <{message, error,data}>
   */
  public async checkAdminById(userId: any): Promise<any> {
    try {
      console.log('userId', userId);

      const adminInfo: any = await AdminModel.findOne({
        where: {
          adminId: userId,
        },
        raw: true,
      });
      console.log('adminInfo', adminInfo);

      if (!!adminInfo === false) {
        throw { message: MESSAGES.USER.PROFILE.FAILURE };
      }
      return {
        error: false,
        message: MESSAGES.USER.PROFILE.SUCCESS,
        data: adminInfo,
      };
    } catch (err: any) {
      return {
        error: true,
        message: err.message,
      };
    }
  }
  public async createWalletForAdmin(adminId: any, address: any): Promise<any> {
    try {
      let createWallet: any;
      if (!!address === false) {
        throw { message: 'Address Required !!' };
      }
      const adminInfo: any = await this.checkAdminById(adminId);
      if (!!adminInfo.error === true) {
        throw { message: MESSAGES.USER.PROFILE.FAILURE };
      }

      const object: any = {
        walletAddress: address,
      };
      console.log('adminInfo.wallet', adminInfo.data.walletAddress);
      console.log('object', object.walletAddress);

      if (!!adminInfo.data.walletAddress === true) {
        if (adminInfo.data.walletAddress === object.walletAddress) {
          throw { message: MESSAGES.ADMIN.EXIST_WALLET };
        } else {
          createWallet = await AdminModel.update(object, {
            where: { adminId: adminId, isActive: 1 },
          });
        }
      } else {
        createWallet = await AdminModel.update(object, {
          where: { adminId: adminId, isActive: 1 },
        });
      }

      console.log('createWallet', createWallet);

      if (!!createWallet === false) {
        throw { message: MESSAGES.USER.PROFILE.FAILURE };
      }

      return {
        error: false,
        message: MESSAGES.ADMIN.WALLET_CREATED,
      };
    } catch (error: any) {
      console.log('error : createWalletForAdmin : ', error);
      return {
        error: true,
        message: error.message,
      };
    }
  }
  public async getEmail(username: string): Promise<any> {
    try {
      const isCheck: any = await AdminUsersModel.findOne({
        where: {
          username,
        },
        raw: true,
      });
      console.log(isCheck, 'isCheck');
      if (!!isCheck) {
        throw { message: MESSAGES.ADMIN.EMAIL_EXITS };
      }
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

  public async createAdminRegister(payload: any) {
    try {
      const registerPayload = {
        username: payload.username,
        password: payload.password,
        walletAddress: payload.walletAddress,
        roleId: payload.roleId,
      };
      console.log(registerPayload, 'registerPayload');

      const data = await sequelize.transaction(async (t: any) => {
        const responseData = await AdminUsersModel.create(registerPayload, {
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
  AdminRoleCheck = async (role: any) => {
    try {
      const ownerCheck: any = await AdminRoleModel.findOne({
        where: {
          role: ADMIN_ROLE.OWNER,
        },
        attributes: ['id'],
        raw: true,
      });
      console.log('ownerCheck', ownerCheck);
      if (ownerCheck === false) {
        throw { message: 'Error in the Admin Roles.' };
      }
      const check = await AdminUsersModel.findAndCountAll({
        where: {
          roleId: ownerCheck.id,
        },
        raw: true,
      });
      const superAdminCheck: any = CONFIG.ADMIN.ADMIN_SUPER_ADMIN;

      if (
        !!check.count &&
        role == ownerCheck.id &&
        check.count >= superAdminCheck
      ) {
        throw { message: `Super Admin can be only ${superAdminCheck}.` };
      }
      return {
        message: 'All clear.',
        error: false,
      };
    } catch (error: any) {
      return {
        message: error.message,
        error: true,
      };
    }
  };

  public async createAdminRoleType(payload: any) {
    try {
      const roleTypePayload = {
        role: payload.role,
      };
      console.log(roleTypePayload, 'roleTypePayload');
      const roleAvailable = Object.values(ADMIN_ROLE);
      if (!roleAvailable.includes(roleTypePayload.role)) {
        throw { message: MESSAGES.ADMIN.WRONG_ROLE_TYPE };
      }
      const data = await sequelize.transaction(async (t: any) => {
        const responseData = await AdminRoleModel.create(roleTypePayload, {
          transaction: t,
        });
        console.log('response for role : ', responseData);
        return responseData;
      });
      return data;
    } catch (err: any) {
      console.log('Error createAdminRoleType :::: ', err);
      return {
        message: err.message,
        error: true,
      };
    }
  }

  public async getRole(role: string): Promise<any> {
    try {
      const isCheck: any = await AdminRoleModel.findAll({
        where: {
          role: role,
        },
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
}

export default new USERHelper();

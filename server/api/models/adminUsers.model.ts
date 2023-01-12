/* eslint-disable prettier/prettier */
// https://sequelize.org/master/manual/model-basics.html
import { resolve } from 'path';
import { DataTypes } from 'sequelize';
import { ADMIN_ROLE } from '../constant/nftFee_type.enum';
import sequelize from '../db/connection';
import * as bcrypt from 'bcrypt';

const AdminUsersModel = sequelize.define(
  'adminUsers',
  {
    adminId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: false,
      defaultValue: 'ADMIN',
    },
    username: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    mobile_no: {
      type: DataTypes.STRING(300),
      allowNull: true,
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 1,
    },
    walletAddress: {
      type: DataTypes.STRING(300),
      allowNull: true,
    },
    roleId: {
      type: DataTypes.STRING(300),
      allowNull: false,
    },
    is_2FA: {
      type: DataTypes.BOOLEAN,
      defaultValue: 0,
    },
    is_email_2FA: {
      type: DataTypes.BOOLEAN,
      defaultValue: 0,
    },
    email_2FA_code: {
      type: DataTypes.STRING,
      defaultValue: 0,
    },
  },
  {
    tableName: 'adminUsers',

    hooks: {
      beforeCreate: async (admin: any) => {
        if (admin.password) {
          const salt = await bcrypt.genSaltSync(10);
          admin.password = bcrypt.hashSync(admin.password, salt);
        }
      },
      beforeUpdate: async (admin: any) => {
        if (admin.password) {
          const salt = await bcrypt.genSaltSync(10);
          admin.password = bcrypt.hashSync(admin.password, salt);
        }
      },
    },
  }
);
// This checks what is the current state of the table in the database (which columns it has, what are their data types, etc), and then performs the necessary changes in the table to make it match the model.
AdminUsersModel.sync({ alter: true });

export default AdminUsersModel;

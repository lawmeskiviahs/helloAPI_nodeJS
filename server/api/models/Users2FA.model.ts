// https://sequelize.org/master/manual/model-basics.html
import { DataTypes } from 'sequelize';
import sequelize from '../db/connection';

const Users2FAModel = sequelize.define(
  'users2FA',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.STRING(300),
      allowNull: false,
    },
    secret: {
      type: DataTypes.STRING(300),
      allowNull: true,
    },
    is_enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: 0,
    },
    qrCodeUrl: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    temp_token: {
      type: DataTypes.STRING(300),
      allowNull: true,
    },
  },
  {
    tableName: 'users2FA',
    modelName: 'users2FA',
  }
);
Users2FAModel.sync({ alter: false });
// This checks what is the current state of the table in the database (which columns it has, what are their data types, etc), and then performs the necessary changes in the table to make it match the model.
export default Users2FAModel;

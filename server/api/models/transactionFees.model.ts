import { DataTypes } from 'sequelize';
import { NFTFEES_TYPE } from '../constant/nftFee_type.enum';
import sequelize from '../db/connection';

const TransactionFees = sequelize.define(
  'transactionfees',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    fees: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    types: {
      type: DataTypes.ENUM,
      values: Object.values(NFTFEES_TYPE),
      defaultValue: NFTFEES_TYPE.fixed,
    },
    is_active: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
  },
  { tableName: 'transactionfees' }
);
TransactionFees.sync({ alter: false });
export default TransactionFees;

import { DataTypes } from 'sequelize';
import { NFTFEES_TYPE } from '../constant/nftFee_type.enum';
import sequelize from '../db/connection';

const NFTFees = sequelize.define(
  'nft_fees',
  {
    nft_fees_id: {
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
  { tableName: 'nft_fees' }
);
NFTFees.sync({ alter: false });
export default NFTFees;

import { DataTypes } from 'sequelize';
import { NFTFEES_TYPE } from '../constant/nftFee_type.enum';
import sequelize from '../db/connection';

const AdminFees = sequelize.define(
  'admin_fees',
  {
    admin_fees_id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    fees: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    types: {
      type: DataTypes.ENUM,
      values: Object.values(NFTFEES_TYPE),
      defaultValue: NFTFEES_TYPE.percentage,
    },
    is_active: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
  },
  { tableName: 'admin_fees' }
);
AdminFees.sync({ alter: false });
export default AdminFees;

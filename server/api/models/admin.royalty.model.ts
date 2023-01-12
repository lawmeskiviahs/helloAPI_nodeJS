import { DataTypes } from 'sequelize';
import { NFTFEES_TYPE } from '../constant/nftFee_type.enum';
import sequelize from '../db/connection';

const AdminRoyalty = sequelize.define(
  'admin_royalty',
  {
    admin_royalty_id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    royalty: {
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
  { tableName: 'admin_royalty' }
);
AdminRoyalty.sync({ alter: false });
export default AdminRoyalty;

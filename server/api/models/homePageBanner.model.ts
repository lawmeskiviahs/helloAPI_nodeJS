// https://sequelize.org/master/manual/model-basics.html
import { DataTypes } from 'sequelize';
import sequelize from '../db/connection';

const BannerModel = sequelize.define(
  'homePageBannerImage',
  {
    bannerImageId: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    banner: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 1,
    },
    isFeatured: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 1,
    },
  },
  {
    tableName: 'homePageBannerImage',
  }
);

// This checks what is the current state of the table in the database (which columns it has, what are their data types, etc), and then performs the necessary changes in the table to make it match the model.
BannerModel.sync({ alter: false });
export default BannerModel;

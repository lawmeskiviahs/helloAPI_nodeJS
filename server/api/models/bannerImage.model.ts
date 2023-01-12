// https://sequelize.org/master/manual/model-basics.html
import { DataTypes } from 'sequelize';
import sequelize from '../db/connection';

const BannerModel = sequelize.define(
  'bannerImages',
  {
    bannerImageId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    subTitle: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    gifImage: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 1,
    },
    isFeatured: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 1,
    },
  },
  {
    tableName: 'bannerImages',
  }
);
// This checks what is the current state of the table in the database (which columns it has, what are their data types, etc), and then performs the necessary changes in the table to make it match the model.
BannerModel.sync({ alter: false });

export default BannerModel;

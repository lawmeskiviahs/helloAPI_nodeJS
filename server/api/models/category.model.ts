// https://sequelize.org/master/manual/model-basics.html
import { DataTypes } from 'sequelize';
import sequelize from '../db/connection';

const CategoryModel = sequelize.define(
  'category',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    category_name: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 1,
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0,
    },
  },
  {
    tableName: 'category',
  }
);
// This checks what is the current state of the table in the database (which columns it has, what are their data types, etc), and then performs the necessary changes in the table to make it match the model.
CategoryModel.sync({ alter: false });

export default CategoryModel;

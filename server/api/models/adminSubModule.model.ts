import { DataTypes } from 'sequelize';
import sequelize from '../db/connection';

const AdminSubModule = sequelize.define(
  'sub_module',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    sub_module_name: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 1,
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0,
    },
    moduleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: 'sub_module',
  }
);

// This checks what is the current state of the table in the database (which columns it has, what are their data types, etc), and then performs the necessary changes in the table to make it match the model.
AdminSubModule.sync({ alter: false });

export default AdminSubModule;
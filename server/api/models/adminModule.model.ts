import { DataTypes } from 'sequelize';
import sequelize from '../db/connection';
import AdminSubModule from './adminSubModule.model';

const AdminModule = sequelize.define(
  'module',
  {
    moduleId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    module_name: {
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
  },
  {
    tableName: 'module',
  }
);

AdminModule.hasMany(AdminSubModule, {
  as: 'subModule',
  foreignKey: {
    name: 'moduleId',
    allowNull: false,
  },
});
// This checks what is the current state of the table in the database (which columns it has, what are their data types, etc), and then performs the necessary changes in the table to make it match the model.
AdminModule.sync({ alter: false });

export default AdminModule;
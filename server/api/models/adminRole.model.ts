// https://sequelize.org/master/manual/model-basics.html
import { DataTypes } from 'sequelize';
import { ADMIN_ROLE } from '../constant/nftFee_type.enum';
import sequelize from '../db/connection';
import * as bcrypt from 'bcrypt';


const AdminRoleModel = sequelize.define(
  'adminRoles',
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    role: {
      type: DataTypes.ENUM(),
      values: Object.values(ADMIN_ROLE),
      defaultValue: ADMIN_ROLE.VIEWER
    },
  },
  {
    tableName: 'adminRoles',
  }

);
// This checks what is the current state of the table in the database (which columns it has, what are their data types, etc), and then performs the necessary changes in the table to make it match the model.
AdminRoleModel.sync({ alter: true });

export default AdminRoleModel;

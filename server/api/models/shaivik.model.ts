/* eslint-disable prettier/prettier */
import { INTEGER, STRING } from 'sequelize';
import sequelize from '../db/connection';

const ShaivikRoleModel = sequelize.define(
    'user_demo_data',
    {
      name: {
        type: STRING,
      },
      age: {
        type: INTEGER,
      },
      grade: {
        type: INTEGER
      },
      email: {
        type: STRING
      },
      phone: {
        type: STRING
      }
    },
    {
      tableName: 'user_dummy_data',
    }
  
  );
  // This checks what is the current state of the table in the database (which columns it has, what are their data types, etc), and then performs the necessary changes in the table to make it match the model.
  ShaivikRoleModel.sync({ alter: true });
  
  export default ShaivikRoleModel;
  
// https://sequelize.org/master/manual/model-basics.html
import { DataTypes, literal } from 'sequelize';
import sequelize from '../db/connection';

const ImageMinting = sequelize.define(
  'imageMinting',
  {
    imageMintingId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    status: {
      type: DataTypes.ENUM,
      values: ['PENDING', 'FAILED', 'COMPLETED'],
      defaultValue: 'PENDING',
    },
    link: { type: DataTypes.STRING(400), allowNull: false },
    fileName: { type: DataTypes.STRING(400), allowNull: false },
    createdAt: {
      type: 'TIMESTAMP',
      defaultValue: literal('CURRENT_TIMESTAMP'),
      allowNull: false,
    },
  },
  {
    tableName: 'imageMinting',
  }
);
// This checks what is the current state of the table in the database (which columns it has, what are their data types, etc), and then performs the necessary changes in the table to make it match the model.
ImageMinting.sync({ alter: false });

export default ImageMinting;

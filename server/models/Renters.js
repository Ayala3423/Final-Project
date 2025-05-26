import { DataTypes } from 'sequelize';
import sequelize from '../../DB/init.js';

const Users = sequelize.define("Users", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  username: { type: DataTypes.STRING, allowNull: false, unique: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  address: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  phone: { type: DataTypes.STRING, allowNull: false, unique: true }
});

export default Users;
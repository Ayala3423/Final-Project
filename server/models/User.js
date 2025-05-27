  // models/User.js - הגדרת המודל
  const { DataTypes } = require('sequelize');
  const sequelize = require('../config/sequelize');

  const User = sequelize.define('User', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    id: {
      type: DataTypes.INTEGER,
      allowNull: false, 
      autoIncrement: true,
        primaryKey: true,

    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true
    },
    role: {
      type: DataTypes.ENUM('renter', 'owner', 'admin'),
      allowNull: false
    },
    averageRating: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0,
        validate: {
        min: 0,
        max: 5
      }
    }
  }, {
    tableName: 'Users',
    timestamps: false
  });

  module.exports = User;

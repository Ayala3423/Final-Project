// models/Parking.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Parking = sequelize.define('Parking', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    ownerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users', // שם הטבלה (כפי שנקבע ב־User.js)
            key: 'id'
        },
        onDelete: 'CASCADE' // אם משתמש נמחק - גם החניות שלו יימחקו
    }
    ,
    latitude: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    longitude: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    averageRating: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0,
        validate: {
            min: 0,
            max: 5
        }
    },
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'Parkings',
    timestamps: false
});

module.exports = Parking;

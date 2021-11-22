import {DataTypes} from "sequelize";

export const User = {
    uid: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    login: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    age: DataTypes.INTEGER,
    isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
};
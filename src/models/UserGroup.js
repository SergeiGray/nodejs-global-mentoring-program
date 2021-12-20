import {DataTypes} from "sequelize";

export const UserGroup = {
    ugid: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    uid: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    gid: {
        type: DataTypes.STRING,
        allowNull: false,
    },
};
import {DataTypes} from "sequelize";
import {GROUP_PERMISSIONS} from "../constants/constants";

export const Group = {
    gid: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    permission: {
        type: DataTypes.ARRAY(DataTypes.ENUM(...GROUP_PERMISSIONS)),
        allowNull: false,
    },
};
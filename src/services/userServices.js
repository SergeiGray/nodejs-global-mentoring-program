import {Op} from "sequelize";
import {v4 as uuidv4} from "uuid";
import {connectToDatabase} from "../utils/utils";
import connection from "./dataBaseConnection";
import {User} from "../models/User";
import {validationSchemeForNewUser} from "../utils/validation";


const UsersDB = connectToDatabase(connection, 'User', User);

export const getUserData = async (uid, password) => {
    try {
        return await UsersDB.findOne({ where: { uid: uid, password: password, isDeleted: false }});
    }
    catch {
        return false;
    }
};

export const getUsersData = async (uid, password, data) => {
    try {
        const result = await UsersDB.findOne({ where: { uid: uid, password: password, isDeleted: false }});

        if (result) {
            const users = await UsersDB.findAll({
                where: {
                    login: {
                        [Op.substring]: data.loginSubstring,
                    },
                    isDeleted: false
                }
            });

            return users?.sort().splice(0, data.limit);
        }
    }
    catch {
        return false;
    }
};

export const createUser = async (data) => {
    const { error } = validationSchemeForNewUser.validate(data);

    if (error) return false;

    try {
        const result = await UsersDB.create(
            {
                uid: uuidv4(),
                login: data.login,
                password: data.password,
                age: data.age,
            });

        return !!result;
    }
    catch {
        return false;
    }

};

export const updateUserData = async (uid, password, data) => {
    const { error } = validationSchemeForNewUser.validate(data);

    if (error) return false;

    try {
        const [result] = await UsersDB.update(
            {
                login: data.login,
                password: data.password,
                age: data.age,
            }, {where: {uid: uid, password: password, isDeleted: false}});

        return !!result;
    }
    catch {
        return false;
    }
};

export const deleteUser = async (uid = '', password = '') => {
    try {
        const [ result ] = await UsersDB.update({ isDeleted: true }, { where: { uid: uid, password: password, isDeleted: false }});

        return !!result;
    }
    catch {
        return false;
    }
};
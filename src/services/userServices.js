import sequelize, {Op} from "sequelize";
import {v4 as uuidv4} from "uuid";
import {modelDefinition} from "../utils/utils";
import connection from "./dataBaseConnection";
import {User} from "../models/User";
import {validationSchemeForUser} from "../utils/validation";
import {deleteUserGroupRelationshipBy} from "./userGroupServices";


export const UsersTable = modelDefinition(connection, 'User', User);

export const getUserData = async (uid, password) => {
    try {
        return await UsersTable.findOne({ where: { uid: uid, password: password, isDeleted: false }});
    }
    catch (e) {
        console.log('ERROR', e)
        return false;
    }
};

export const getUsersData = async (uid, password, data) => {
    try {
        const result = await UsersTable.findOne({ where: { uid: uid, password: password, isDeleted: false }});

        if (result) {
            const users = await UsersTable.findAll({
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
    catch (e) {
        console.log('ERROR', e)
        return false;
    }
};

export const createUser = async (data) => {
    const { error } = validationSchemeForUser.validate(data);

    if (error) return false;

    try {
        const result = await UsersTable.create(
            {
                uid: uuidv4(),
                login: data.login,
                password: data.password,
                age: data.age,
            });

        return !!result;
    }
    catch (e) {
        console.log('ERROR', e)
        return false;
    }

};

export const updateUserData = async (uid, password, data) => {
    const { error } = validationSchemeForUser.validate(data);

    if (error) return false;

    try {
        const [result] = await UsersTable.update(
            {
                login: data.login,
                password: data.password,
                age: data.age,
            }, {where: {uid: uid, password: password, isDeleted: false}});

        return !!result;
    }
    catch (e) {
        console.log('ERROR', e)
        return false;
    }
};

export const deleteUser = async (uid = '', password = '') => {
    try {
        await UsersTable.update({ isDeleted: true }, { where: { uid: uid, password: password, isDeleted: false }});
        await deleteUserGroupRelationshipBy('user', uid);

        return true;
    }
    catch (e) {
        console.log('ERROR', e)
        return false;
    }
};
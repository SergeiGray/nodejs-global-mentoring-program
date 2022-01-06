import {Op} from "sequelize";
import {v4 as uuidv4} from "uuid";
import {modelDefinition} from "../utils/utils";
import connection from "./dataBaseConnection";
import {User} from "../models/User";
import {validationSchemeForUser} from "../utils/validation";
import {deleteUserGroupRelationshipBy} from "./userGroupServices";
import {loggingOfMethodUsed} from "../utils/logging";
import {EVENT_MESSAGES} from "../constants/constants";

export const UsersTable = modelDefinition(connection, 'User', User);

export const getUserData = (uid, password) => {
    try {
        loggingOfMethodUsed('info','getUserData', [uid, password]);

        return UsersTable
            .findOne({
                where: {
                    uid: uid,
                    password: password,
                    isDeleted: false,
                }
            });
    } catch (e) {
        loggingOfMethodUsed('error', 'getUserData', [uid, password], e.toString());
    }
};

export const getUsersData = (uid, password, {loginSubstring, limit}) => {
    try {
        loggingOfMethodUsed('info','getUsersData', [uid, password, loginSubstring, limit]);

        return UsersTable
            .findOne({
                where: {
                    uid: uid,
                    password: password,
                    isDeleted: false
                }
            })
            .then((result) => {
                if(result) {
                    return UsersTable.findAll({
                        where: {
                            login: {
                                [Op.substring]: loginSubstring,
                            },
                            isDeleted: false
                        }
                    });
                }

                throw new Error(EVENT_MESSAGES.updateError);
            });
    } catch (e) {
        loggingOfMethodUsed('error', 'getUsersData', [uid, password, loginSubstring, limit], e.toString());
    }
};

export const createUser = ({login, password, age}) => {
    try {
        loggingOfMethodUsed('info', 'createUser', [login, password, age]);

        const { error } = validationSchemeForUser.validate({login, password, age});

        if (error) {
            throw error;
        } else {
            return UsersTable.create(
                {
                    uid: uuidv4(),
                    login: login,
                    password: password,
                    age: age,
                });
        }
    } catch (e) {
        loggingOfMethodUsed('error', 'createUser', [login, password, age], e.toString());
    }
};

export const updateUserData = (uid, currentPassword, {login, password, age}) => {
    try {
        loggingOfMethodUsed('info', 'updateUserData', [uid, currentPassword, login, password, age]);

        const { error } = validationSchemeForUser.validate({login, password, age});

        if (error) {
            throw error;
        } else {
            return UsersTable
                .update({
                    login: login,
                    password: password,
                    age: age
                }, {
                    where: {
                        uid: uid,
                        password: currentPassword,
                        isDeleted: false
                    }
                })
                .then(([result]) => {
                    if(result) {
                        return true;
                    }

                    throw new Error(EVENT_MESSAGES.updateError);
                });
        }
    } catch (e) {
        loggingOfMethodUsed('error', 'updateUserData', [uid, currentPassword, login, password, age], e.toString());
    }
};

export const deleteUser = (uid = '', password = '') => {
    try {
        loggingOfMethodUsed('info', 'deleteUser', [uid, password]);

        return UsersTable
            .update({
                isDeleted: true
            }, {
                where: {
                    uid: uid,
                    password: password,
                    isDeleted: false
                }
            })
            .then((result) => {
                if(result) {
                    return deleteUserGroupRelationshipBy('user', uid);
                }

                throw new Error(EVENT_MESSAGES.updateError);
            });
    } catch (e) {
        loggingOfMethodUsed('error', 'deleteUser', [uid, password], e.toString());
    }
};
import {modelDefinition} from "../utils/utils";
import connection from "./dataBaseConnection";
import {UserGroup} from "../models/UserGroup";
import {v4 as uuidv4} from "uuid";

const UserGroupsTable = modelDefinition(connection, 'UserGroup', UserGroup);

export const createUserGroupRelationship = (gid, uid, t) => {
    return UserGroupsTable.create({
        ugid: uuidv4(),
        uid: uid,
        gid: gid,
    }, { transaction: t })
};

export const addUsersToGroup = async (gid, uids) => {
    try {
        await UserGroupsTable.sequelize.transaction({}, async (t) => {
            for (const uid of uids) {
                await createUserGroupRelationship(gid, uid, t);
            }
        });

        return true;
    }
    catch (e) {
        console.log('ERROR', e)
        return false;
    }
};

export const deleteUserGroupRelationshipBy = async (target, id) => {
    if (target === 'user' || target === 'group') {
        const name = target === 'user' ? 'uid' : 'gid';

        return await UserGroupsTable.destroy({where: {[name]: id}});
    }
};
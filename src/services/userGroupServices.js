import {modelDefinition} from "../utils/utils";
import connection from "./dataBaseConnection";
import {UserGroup} from "../models/UserGroup";
import {v4 as uuidv4} from "uuid";
import {loggingOfMethodUsed} from "../utils/logging";
import {EVENT_MESSAGES} from "../constants/constants";

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
        loggingOfMethodUsed("addUsersToGroup", [gid, ...uids]);

        await UserGroupsTable.sequelize.transaction({}, async (t) => {
            for (const uid of uids) {
                await createUserGroupRelationship(gid, uid, t);
            }
        });

        return true;
    } catch (e) {
        loggingOfMethodUsed('error', 'addUsersToGroup', [gid, ...uids], e.toString());
    }
};

export const deleteUserGroupRelationshipBy = (target, id) => {
    try {
        loggingOfMethodUsed("deleteUserGroupRelationshipBy", [target, id]);

        if (target === 'user' || target === 'group') {
            const name = target === 'user' ? 'uid' : 'gid';

            return UserGroupsTable.destroy({where: {[name]: id}});
        } else {
            throw new Error(EVENT_MESSAGES.deleteError);
        }
    } catch (e) {
        loggingOfMethodUsed('error', 'deleteUserGroupRelationshipBy', [target, id], e.toString());
    }
};
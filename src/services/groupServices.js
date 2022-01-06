import {v4 as uuidv4} from "uuid";
import {modelDefinition} from "../utils/utils";
import connection from "./dataBaseConnection";
import {Group} from "../models/Group";
import {validationSchemeForGroup} from "../utils/validation";
import {deleteUserGroupRelationshipBy} from "./userGroupServices";
import {loggingOfMethodUsed} from "../utils/logging";
import {EVENT_MESSAGES} from "../constants/constants";

export const GroupsTable = modelDefinition(connection, 'Group', Group);

export const getGroupById = (gid) => {
    try {
        loggingOfMethodUsed('info','getGroupById', [gid]);

        return GroupsTable.findOne({ where: { gid: gid}});
    } catch (e) {
        loggingOfMethodUsed('error', 'getGroupById', [gid], e.toString());
    }
};

export const getGroups = () => {
    try {
        loggingOfMethodUsed('info','getGroups', []);

        return GroupsTable.findAll();
    } catch (e) {
        loggingOfMethodUsed('error', 'getGroups', [], e.toString());
    }
};

export const createGroup = (name, permission) => {
    try {
        loggingOfMethodUsed('info','createGroup', [name, permission]);

        const { error } = validationSchemeForGroup.validate({name, permission});

        if (error) {
            throw error;
        } else {
            return GroupsTable.create(
                {
                    gid: uuidv4(),
                    name: name,
                    permission: permission,
                });
        }
    } catch (e) {
        loggingOfMethodUsed('error', 'createGroup', [name, permission], e.toString());
    }
};

export const updateGroup = (gid, name, permission) => {
    try {
        loggingOfMethodUsed('info','updateGroup', [name, permission]);

        const { error } = validationSchemeForGroup.validate({name, permission});

        if (error) {
            throw error;
        } else {
            return GroupsTable.update(
                {
                    name: name,
                    permission: permission,
                }, {where: {gid: gid}});
        }
    } catch (e) {
        loggingOfMethodUsed('error', 'updateGroup', [name, permission], e.toString());
    }
};

export const deleteGroup = async (gid = '') => {
    try {
        loggingOfMethodUsed('info','deleteGroup', [gid]);

        return GroupsTable
            .destroy({
                where: {gid: gid}
            })
            .then((result) => {
                if(result) {
                    return deleteUserGroupRelationshipBy('group', gid);
                }

                throw new Error(EVENT_MESSAGES.updateError);
            });
    } catch (e) {
        loggingOfMethodUsed('error', 'deleteGroup', [gid], e.toString());
    }
};
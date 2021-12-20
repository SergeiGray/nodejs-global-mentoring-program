import {v4 as uuidv4} from "uuid";
import {modelDefinition} from "../utils/utils";
import connection from "./dataBaseConnection";
import {Group} from "../models/Group";
import {validationSchemeForGroup} from "../utils/validation";
import {deleteUserGroupRelationshipBy} from "./userGroupServices";


export const GroupsTable = modelDefinition(connection, 'Group', Group);

export const getGroupById = async (gid) => {
    try {
        return await GroupsTable.findOne({ where: { gid: gid}});
    }
    catch (e) {
        console.log('ERROR', e)
        return false;
    }
};

export const getGroups = async () => {
    try {
        return await GroupsTable.findAll();
    }
    catch (e) {
        console.log('ERROR', e)
        return false;
    }
};

export const createGroup = async (data) => {
    const { error } = validationSchemeForGroup.validate(data);

    if (error) return false;

    try {
        const result = await GroupsTable.create(
            {
                gid: uuidv4(),
                name: data.name,
                permission: data.permission,
            });

        return !!result;
    }
    catch (e) {
        console.log('ERROR', e)
        return false;
    }

};

export const updateGroup = async (gid, data) => {
    const { error } = validationSchemeForGroup.validate(data);

    if (error) return false;

    try {
        const [result] = await GroupsTable.update(
            {
                name: data.name,
                permission: data.permission,
            }, {where: {gid: gid}});
        console.log('LOG', result)
        return !!result;
    }
    catch (e) {
        console.log('ERROR', e)
        return false;
    }
};

export const deleteGroup = async (gid = '') => {
    try {
        await GroupsTable.destroy({where: {gid: gid}});
        await deleteUserGroupRelationshipBy('group', gid);

        return true;
    }
    catch (e) {
        console.log('ERROR', e)
        return false;
    }
};
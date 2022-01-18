import {createGroup, deleteGroup, getGroupById, getGroups, GroupsTable, updateGroup} from "./groupServices";

jest.mock('uuid')
jest.mock('./dataBaseConnection', () => jest.fn());
jest.mock('../utils/logging', () => ({
    loggingOfMethodUsed: jest.fn()
}));
jest.mock('../utils/utils', () => ({
    modelDefinition: jest.fn(() => ({
        create: jest.fn(),
        update: jest.fn(),
        findOne: jest.fn(),
        findAll: jest.fn(),
        destroy: jest.fn(),
    }))
}));

const gid = '123';
const name = 'Admin';
const searchObject = {
    where: {
        gid: gid,
    }
};

describe('getGroupById', () => {
    it('should call the database with the correct arguments', () => {
        getGroupById(gid);

        expect(GroupsTable.findOne).toHaveBeenLastCalledWith(searchObject);
    });
});

describe('getGroups', () => {
    it('should call the database ', () => {
        getGroups();

        expect(GroupsTable.findAll).toHaveBeenCalled();
    });
});

describe('createGroup', () => {
    it('should not call the database if no arguments are passed', () => {
        const permission = '';

        createGroup(name, permission);

        expect(GroupsTable.create).not.toHaveBeenCalled();
    });

    it('should not call the database if no arguments are passed', () => {
        const permission = ['QWERTY'];

        createGroup(name, permission);

        expect(GroupsTable.create).not.toHaveBeenCalled();
    });

    it('should not call the database if no arguments are passed', () => {
        const permission = [];

        createGroup(name, permission);

        expect(GroupsTable.create).not.toHaveBeenCalled();
    });

    it('should call the database if the arguments are valid', () => {
        const permission = ['READ', 'WRITE'];

        createGroup(name, permission);

        expect(GroupsTable.create).toHaveBeenCalled();
    });
});

describe('updateGroup', () => {
    it('should not call the database if no arguments are passed', () => {
        const permission = '';

        updateGroup(gid, name, permission);

        expect(GroupsTable.update).not.toHaveBeenCalled();
    });

    it('should not call the database if no arguments are passed', () => {
        const permission = ['QWERTY'];

        updateGroup(gid, name, permission);

        expect(GroupsTable.update).not.toHaveBeenCalled();
    });

    it('should not call the database if no arguments are passed', () => {
        const permission = [];

        updateGroup(gid, name, permission);

        expect(GroupsTable.update).not.toHaveBeenCalled();
    });

    it('should call the database if the arguments are valid', () => {
        const permission = ['READ', 'WRITE'];

        updateGroup(gid, name, permission);

        expect(GroupsTable.update).toHaveBeenCalled();
    });
});

describe('deleteGroup', () => {
    it('should call the database with the correct arguments', () => {
        deleteGroup(gid);

        expect(GroupsTable.destroy).toHaveBeenLastCalledWith(searchObject);
    });
});
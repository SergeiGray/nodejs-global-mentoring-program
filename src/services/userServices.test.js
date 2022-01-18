import {createUser, deleteUser, getUserData, identifyUser, updateUserData, UsersTable} from "./userServices";

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
    }))
}));

const uid = '123';
const currentPassword = 'qwerty123';
const searchObject = {
    where: {
        uid: uid,
        password: currentPassword,
        isDeleted: false
    }
};

describe('createUser', () => {
    it('should not call the database if no arguments are passed', () => {
        const data = {};

        createUser(data);

        expect(UsersTable.create).not.toHaveBeenCalled();
    });

    it('should not call the database if the arguments are not valid', () => {
        const data = {
            login: 33,
            password: 'qwerty',
            age: 'Nikolay',
        };

        createUser(data);

        expect(UsersTable.create).not.toHaveBeenCalled();
    });

    it('should call the database if the arguments are valid', () => {
        const data = {
            login: 'Nikolay',
            password: 'qwerty123',
            age: 33,
        };

        createUser(data);

        expect(UsersTable.create).toHaveBeenCalled();
    });

    it('should call the database with the correct arguments if the arguments are valid', () => {
        const data = {
            login: 'Nikolay',
            password: 'qwerty123',
            age: 33,
        };

        createUser(data);

        expect(UsersTable.create).toHaveBeenLastCalledWith(data);
    });
});

describe('updateUserData', () => {
    it('should not call the database if no arguments are passed', () => {
        const data = {};

        updateUserData(uid, currentPassword, data);

        expect(UsersTable.update).not.toHaveBeenCalled();
    });

    it('should not call the database if the arguments are not valid', () => {
        const data = {
            login: 33,
            password: 'qwerty',
            age: 'Nikolay',
        };

        updateUserData(uid, currentPassword, data);

        expect(UsersTable.update).not.toHaveBeenCalled();
    });

    it('should call the database if the arguments are valid', () => {
        const data = {
            login: 'Nikolay',
            password: 'qwerty123',
            age: 33,
        };

        updateUserData(uid, currentPassword, data);

        expect(UsersTable.update).toHaveBeenCalled();
    });

    it('should call the database with the correct arguments if the arguments are valid', () => {
        const data = {
            login: 'Nikolay',
            password: 'qwerty123',
            age: 33,
        };

        updateUserData(uid, currentPassword, data);

        expect(UsersTable.update).toHaveBeenLastCalledWith(data, searchObject);
    });
});

describe('getUserData', () => {
    it('should call the database with the correct arguments', () => {
        getUserData(uid, currentPassword);

        expect(UsersTable.findOne).toHaveBeenLastCalledWith(searchObject);
    });
});

describe('getUsersData', () => {
    it('should call the database with the correct arguments', () => {
        const data = {
            loginSubstring: 'qwe',
            limit: 5,
        };

        getUserData(uid, currentPassword, data);

        expect(UsersTable.findOne).toHaveBeenLastCalledWith(searchObject);
    });
});

describe('deleteUser', () => {
    it('should call the database with the correct arguments', () => {
        deleteUser(uid, currentPassword);

        expect(UsersTable.update).toHaveBeenLastCalledWith({isDeleted: true}, searchObject);
    });
});

describe('identifyUser', () => {
    it('should call the database with the correct arguments', () => {
        const searchObject = {
            where: {
                login: uid,
                password: currentPassword,
                isDeleted: false
            }
        };

        identifyUser({login: uid, password: currentPassword});

        expect(UsersTable.findOne).toHaveBeenLastCalledWith(searchObject);
    });
});
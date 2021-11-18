import express from 'express';
import multer from 'multer';
import Joi from 'joi';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const upload = multer();

const PORT = 3000;
const HEADERS = {
    id: 'x-user-id',
    password: 'x-user-password',
};
const UPDATED_FIELDS = ['login', 'password', 'age'];

const mockUsers = [
    {
        id: '123',
        login: 'Stepan',
        password: 'qwerty',
        age: 7,
        isDeleted: false,
    },
    {
        id: '456',
        login: 'Semeon',
        password: 'qwerty456',
        age: 17,
        isDeleted: false,
    },
    {
        id: '789',
        login: 'Sergey',
        password: 'qwerty789',
        age: 27,
        isDeleted: false,
    },
    {
        id: '123',
        login: 'Sedrgak',
        password: 'qwerty123',
        age: 7,
        isDeleted: false,
    },
];

const users = [...mockUsers];

const schema = Joi.object({
    login: Joi.string()
        .required(),
    password: Joi.string()
        .pattern(new RegExp('(?=.*[0-9])(?=.*[a-zA-Z])'))
        .required(),
    age: Joi.number()
        .min(4)
        .max(130)
        .required(),
});

const findUserById = (id,  users) => users.find(user => user.id === id);
const findUserByLogin = (login,  users) => users.find(user => user.login === login);
const checkingForAccess = (password, user) => password && user && user.password === password;


const getAutoSuggestUsers = (loginSubstring, limit, users) => users
    .filter(user => user.login.includes(loginSubstring))
    .map(user => user.login)
    .sort()
    .splice(0, limit)

const getUserData = (req, res) => {
    const {loginSubstring, limit} = req.query;
    const {[HEADERS.id]: userId, [HEADERS.password]: userPassword} = req.headers;
    const user = findUserById(userId, users);
    const allowed = !loginSubstring && checkingForAccess(userPassword, user);
    let message = 'User data acquisition operation error';

    if (allowed) {
        message = `User data:
            ID: ${user.id}
            Login: ${user.login}
            Password: ${user.password}
            Age: ${user.age}
        `;
    }

    if (loginSubstring && limit) {
        const listOfUsers = getAutoSuggestUsers(loginSubstring, limit, users);

        message = `List of eligible users ${listOfUsers}`;
    }

    console.log(message, users, loginSubstring);
    res.send(message)
};

const createUser = (req, res) => {
    const { error } = schema.validate(req.body);
    let message = 'Such a user already exists';

    if (error) {
        message = error.message;
        res.status(400).send(message);
    } else {
        const { login, password, age } = req.body;
        const user = findUserByLogin(login, users);

        if (!user && login && password && age) {
            const id = uuidv4();
            users.push({
                id,
                login,
                password,
                age: Number(age),
                isDeleted: false,
            })
            message = `A new user has been created. ID: ${id}`;
        }
    }

    console.log(message, users);
    res.send(message)
};

const updateUserData = (req, res) => {
    const { error } = schema.validate(req.body);
    let message = 'User data update operation error';

    if (error) {
        message = error.message;
        res.status(400).send(message);
    } else {
        const {[HEADERS.id]: userId, [HEADERS.password]: userPassword} = req.headers;
        const user = findUserById(userId, users);
        const allowed = checkingForAccess(userPassword, user);

        if (allowed) {
            UPDATED_FIELDS.forEach(field => {
                if (req.body[field]) user[field] = req.body[field]
            })
            message = 'User data updated';
        }
    }

    console.log(message, users);
    res.send(message)
};

const deleteUser = (req, res) => {
    const {[HEADERS.id]: id, [HEADERS.password]: password} = req.headers;
    const user = findUserById(id, users);
    const allowed = checkingForAccess(password, user);
    let message = 'Deletion operation error';

    if (allowed) {
        user.isDeleted = true;
        message = 'The user has been successfully deleted'
    }
    console.log(message, users);
    res.send(message)
};

app.route('/user')
    .get(getUserData)
    .post(upload.none(), createUser)
    .patch(upload.none(), updateUserData)
    .delete(deleteUser)

app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
})
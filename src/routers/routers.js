import express from "express";
import multer from "multer";
import {
    EVENT_MESSAGES,
    HEADERS_OF_THE_GROUP_OPERATIONS_REQUEST,
    HEADERS_OF_THE_USER_OPERATIONS_REQUEST
} from "../constants/constants";
import {createUser, deleteUser, getUserData, getUsersData, updateUserData} from "../services/userServices";
import {createGroup, deleteGroup, getGroupById, getGroups, updateGroup} from "../services/groupServices";
import {addUsersToGroup} from "../services/userGroupServices";

const app = express();
const upload = multer();

const port = process.env.SERVER_PORT || 3000;
const headersOfUser = HEADERS_OF_THE_USER_OPERATIONS_REQUEST;
const headersOfGroup = HEADERS_OF_THE_GROUP_OPERATIONS_REQUEST;

app.route('/user')
    .get(async (req, res) => {
        const {[headersOfUser.uid]: uid, [headersOfUser.password]: password} = req.headers;
        const result = await getUserData(uid, password);
        const message = result ? `${EVENT_MESSAGES.userFound} - ${result?.login}` : EVENT_MESSAGES.searchError;

        console.log(message);
        res.send(message)
    })
    .post(upload.none(), async (req, res) => {
        const data = req.body;
        const result = await createUser(data);
        const message = result ? EVENT_MESSAGES.userCreated : EVENT_MESSAGES.userCreationError;

        console.log(message);
        res.send(message)
    })
    .patch(upload.none(), async (req, res) => {
        const {[headersOfUser.uid]: uid, [headersOfUser.password]: password} = req.headers;
        const data = req.body;
        const result = await updateUserData(uid, password, data);
        const message = result ? EVENT_MESSAGES.userDataUpdated : EVENT_MESSAGES.updateError;

        console.log(message);
        res.send(message)
    })
    .delete(async (req, res) => {
        const {[headersOfUser.uid]: uid, [headersOfUser.password]: password} = req.headers;
        const result = await deleteUser(uid, password);
        const message = result ? EVENT_MESSAGES.userDeleted : EVENT_MESSAGES.deleteError;

        console.log(message);
        res.send(message)
    })

app.route('/users')
    .get(async (req, res) => {
        const {[headersOfUser.uid]: uid, [headersOfUser.password]: password} = req.headers;
        const data = req.query;
        const result = await getUsersData(uid, password, data);
        const message = result ? `${EVENT_MESSAGES.usersFound} - ${result?.length}` : EVENT_MESSAGES.searchError;

        console.log(message);
        res.send(message)
    })
    .post(upload.none(), async (req, res) => {
        const data = req.body;
        const result = await addUsersToGroup(data.gid, data.uids);
        const message = result ? EVENT_MESSAGES.addUsersToGroup : EVENT_MESSAGES.addUsersToGroupError;

        console.log(message);
        res.send(message)
    })

app.route('/group')
    .get(async (req, res) => {
        const {[headersOfGroup.gid]: gid} = req.headers;
        const result = await getGroupById(gid);
        let message = result ? `${EVENT_MESSAGES.userFound} - ${result?.name}` : EVENT_MESSAGES.searchError;

        console.log(message);
        res.send(message)
    })
    .post(upload.none(), async (req, res) => {
        const data = req.body;
        const result = await createGroup(data);
        const message = result ? EVENT_MESSAGES.groupCreated : EVENT_MESSAGES.groupCreationError;

        console.log(message);
        res.send(message)
    })
    .patch(upload.none(), async (req, res) => {
        const {[headersOfGroup.gid]: gid} = req.headers;
        const data = req.body;
        const result = await updateGroup(gid, data);
        const message = result ? EVENT_MESSAGES.groupDataUpdated : EVENT_MESSAGES.updateError;

        console.log(message);
        res.send(message)
    })
    .delete(async (req, res) => {
        const {[headersOfGroup.gid]: gid} = req.headers;
        const result = await deleteGroup(gid);
        const message = result ? EVENT_MESSAGES.groupDeleted : EVENT_MESSAGES.deleteError;

        console.log(message);
        res.send(message)
    })

app.route('/groups')
    .get(async (req, res) => {
        const result = await getGroups();
        const message = result ? `${EVENT_MESSAGES.usersFound} - ${result?.length}` : EVENT_MESSAGES.searchError;

        console.log(message);
        res.send(message)
    })

const startRouting = () => app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
})

export default startRouting;
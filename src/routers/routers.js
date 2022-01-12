import express from "express";
import multer from "multer";
import {
    EVENT_MESSAGES,
    HEADERS_OF_THE_GROUP_OPERATIONS_REQUEST,
    HEADERS_OF_THE_USER_OPERATIONS_REQUEST
} from "../constants/constants";
import {
    createUser,
    deleteUser,
    getUserData,
    getUsersData,
    identifyUser,
    updateUserData
} from "../services/userServices";
import {createGroup, deleteGroup, getGroupById, getGroups, updateGroup} from "../services/groupServices";
import {addUsersToGroup} from "../services/userGroupServices";
import {auth} from "../utils/auth";

const router = express.Router()
const upload = multer();

const headersOfUser = HEADERS_OF_THE_USER_OPERATIONS_REQUEST;
const headersOfGroup = HEADERS_OF_THE_GROUP_OPERATIONS_REQUEST;

router.route('/user')
    .get(auth, async (req, res, next) => {
        try {
            const {[headersOfUser.uid]: uid, [headersOfUser.password]: password} = req.headers;
            const result = await getUserData(uid, password);
            const message = result ? EVENT_MESSAGES.userFound : EVENT_MESSAGES.searchError;

            res.send(message)
        } catch (err) {
            next(err)
        }
    })
    .post(upload.none(), async (req, res, next) => {
        try {
            const data = req.body;
            const result = await createUser(data);
            const message = result ? EVENT_MESSAGES.userCreated : EVENT_MESSAGES.userCreationError;

            res.send(message)
        } catch (err) {
            next(err)
        }
    })
    .patch(upload.none(), auth, async (req, res, next) => {
        try {
            const {[headersOfUser.uid]: uid, [headersOfUser.password]: password} = req.headers;
            const data = req.body;
            const result = await updateUserData(uid, password, data);
            const message = result ? EVENT_MESSAGES.userDataUpdated : EVENT_MESSAGES.updateError;

            res.send(message)
        } catch (err) {
            next(err)
        }
    })
    .delete(auth, async (req, res, next) => {
        try {
            const {[headersOfUser.uid]: uid, [headersOfUser.password]: password} = req.headers;
            const result = await deleteUser(uid, password);
            const message = result ? EVENT_MESSAGES.userDeleted : EVENT_MESSAGES.deleteError;

            res.send(message)
        } catch (err) {
            next(err)
        }
    })

router.route('/users')
    .get(auth, async (req, res, next) => {
        try {
            const {[headersOfUser.uid]: uid, [headersOfUser.password]: password} = req.headers;
            const data = req.query;
            const result = await getUsersData(uid, password, data);
            const message = result ? EVENT_MESSAGES.usersFound : EVENT_MESSAGES.searchError;

            res.send(message)
        } catch (err) {
            next(err)
        }
    })
    .post(upload.none(), auth, async (req, res, next) => {
        try {
            const data = req.body;
            const result = await addUsersToGroup(data.gid, data.uids);
            const message = result ? EVENT_MESSAGES.addUsersToGroup : EVENT_MESSAGES.addUsersToGroupError;

            res.send(message)
        } catch (err) {
            next(err)
        }
    })

router.route('/group')
    .get(auth, async (req, res, next) => {
        try {
            const {[headersOfGroup.gid]: gid} = req.headers;
            const result = await getGroupById(gid);
            let message = result ? EVENT_MESSAGES.userFound : EVENT_MESSAGES.searchError;

            res.send(message)
        } catch (err) {
            next(err)
        }
    })
    .post(upload.none(), auth, async (req, res, next) => {
        try {
            const {name, permission} = req.body;
            const result = await createGroup(name, permission);
            const message = result ? EVENT_MESSAGES.groupCreated : EVENT_MESSAGES.groupCreationError;

            res.send(message)
        } catch (err) {
            next(err)
        }
    })
    .patch(upload.none(), auth, async (req, res, next) => {
        try {
            const {[headersOfGroup.gid]: gid} = req.headers;
            const {name, permission} = req.body;
            const result = await updateGroup(gid, name, permission);
            const message = result ? EVENT_MESSAGES.groupDataUpdated : EVENT_MESSAGES.updateError;

            res.send(message)
        } catch (err) {
            next(err)
        }
    })
    .delete(auth, async (req, res, next) => {
        try {
            const {[headersOfGroup.gid]: gid} = req.headers;
            const result = await deleteGroup(gid);
            const message = result ? EVENT_MESSAGES.groupDeleted : EVENT_MESSAGES.deleteError;

            res.send(message)
        } catch (err) {
            next(err)
        }
    })

router.route('/groups')
    .get(auth, async (req, res, next) => {
        try {
            const result = await getGroups();
            const message = result ? `${EVENT_MESSAGES.groupsFound} - ${result?.length}` : EVENT_MESSAGES.searchError;

            res.send(message)
        } catch (err) {
            next(err)
        }
    })

router.route('/auth')
    .post(upload.none(), async (req, res, next) => {
        try {
            const data = req.body;
            const token = await identifyUser(data);

            res.send(token)
        } catch (err) {
            next(err)
        }
    })

export default router;
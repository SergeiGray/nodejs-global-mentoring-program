import express from 'express';
import multer from 'multer';
import {ERROR_MESSAGES, HEADERS_OF_THE_USER_OPERATIONS_REQUEST} from "../constants/constants";
import {createUser, deleteUser, getUserData, getUsersData, updateUserData} from "../services/userServices";

const app = express();
const upload = multer();

const port = process.env.SERVER_PORT || 3000;
const headers = HEADERS_OF_THE_USER_OPERATIONS_REQUEST

app.route('/user')
    .get(async (req, res) => {
        const {[headers.uid]: uid, [headers.password]: password} = req.headers;
        const data = req.query;
        let message = ERROR_MESSAGES.searchError;

        if (data?.loginSubstring && data?.limit) {
            const result = await getUsersData(uid, password, data);

            if (result?.length) {
                message = `${ERROR_MESSAGES.usersFound} - ${result?.length}`;
            }
        } else {
            const result = await getUserData(uid, password);

            if (result) {
                message = `${ERROR_MESSAGES.userFound}`;
            }
        }

        console.log(message);
        res.send(message)
    })
    .post(upload.none(), async (req, res) => {
        const data = req.body;
        const result = await createUser(data);
        const message = result ? ERROR_MESSAGES.userCreated : ERROR_MESSAGES.userCreationError;

        console.log(message);
        res.send(message)
    })
    .patch(upload.none(), async (req, res) => {
        const {[headers.uid]: uid, [headers.password]: password} = req.headers;
        const data = req.body;
        const result = await updateUserData(uid, password, data);
        const message = result ? ERROR_MESSAGES.userDataUpdated : ERROR_MESSAGES.updateError;

        console.log(message);
        res.send(message)
    })
    .delete(async (req, res) => {
        const {[headers.uid]: uid, [headers.password]: password} = req.headers;
        const result = await deleteUser(uid, password);
        const message = result ? ERROR_MESSAGES.userDeleted : ERROR_MESSAGES.deleteError;

        console.log(message);
        res.send(message)
    })

    const startRouting = () => app.listen(port, () => {
        console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
    })

export default startRouting;
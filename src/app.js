import express from "express";
import expressWinston from "express-winston";
import morgan from "morgan";
import router from "./routers/routers";
import {logger} from "./utils/logging";

const port = process.env.SERVER_PORT || 3000;
const app = express();

process.on('unhandledRejection', (reason) => {
    logger.error(`An unprocessed rejection of a promise has been registered: ${reason}`);
    process.exit(1);
});

process.on('uncaughtException', (error) => {
    logger.error(`Report on exception: ${error}`);
    process.exit(1);
});

app.use(morgan("combined", { stream: logger.stream }));
app.use(router);
app.use(expressWinston.errorLogger({
    winstonInstance: logger,
    msg: "{{req.url}} {{req.method}} {{err.message}}",
}));
app.use((error, req, res) => {
    return res.status(process.env.HTTP_SERVER_ERROR).json({ error: error.toString() });
});
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
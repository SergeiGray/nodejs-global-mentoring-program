import jwt from "jsonwebtoken";

export const getToken = (uid, login, password) => jwt.sign({ uid, login, password }, process.env.JWT_PRIVATE_KEY, { expiresIn: '1h' });

export const auth = (req, res, next) => {
    try {
        const token = req.headers?.authorization?.split(' ')[1];

        if (!token) return res.status(401).send("Unauthorized Error");

        req.user = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
        next()
    } catch (err) {
        res.status(403).send("Forbidden Error");
    }
};

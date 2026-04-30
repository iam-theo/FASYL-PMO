import { verifyAccessToken } from "../utils/jwt.js";

export const authMiddleWare  = (req, res, next) => {
    const header = req.headers.authorization;

    if(!header) return res.sendStatus(401).json({ error: "No token provided" });

    const token = header.split(' ')[1];

    try{
        const user = verifyAccessToken(token);
        req.user = user;
        next();
    } catch{
        return res.sendStatus(403);
    }
};
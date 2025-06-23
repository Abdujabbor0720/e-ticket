import config from "../config/index.js";
import { resError } from "../helpers/resError.js";
import { Token } from "../utils/token-service.js";

const tokenServise = new Token();

export const AuthGuard = async (req, res, next) => {
    const auth = req.headers.authorization;
    if (!auth) {
        return resError(res, `Authorization error`, 401);
    }
    const bearer = auth.split(' ')[0];
    const token = auth.split(' ')[1];
    if (!bearer || bearer != 'Bearer' || !token) {
        return resError(res, `Token error`, 401);
    }
    try {
        const user = await tokenServise.verifyToken(
            token,
            config.ACCESS_TOKEN_KEY
        );
        req.user = user;
        next();
    } catch (error) {
        return resError(res, 'Unauthorized', 401);
    }
}
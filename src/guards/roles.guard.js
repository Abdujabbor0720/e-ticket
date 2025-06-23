import { resError } from "../helpers/resError.js"

export const RolesGuard = (includeRole = []) => {
    return (req, res, next) => {
        if (!includeRole.includes(req.user?.role)) {
            return resError(res, `Forbidden user`, 403);
        }
        next();
    }
}
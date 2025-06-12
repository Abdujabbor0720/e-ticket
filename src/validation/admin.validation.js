import Joi from "joi";

export const createValidator = (data) => {
    const admin = Joi.object({
        username: Joi.string().min(4).required(),
        password: Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@!%*?&.,])[A-Za-z\d$@!%*?&.,]{8,32}$/).required()
    });
    return admin.validate(data);
}

export const updateValidator = (data) => {
    const admin = Joi.object({
        username: Joi.string().min(4).optional(),
        password: Joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@!%*?&.,])[A-Za-z\d$@!%*?&.,]{8,32}$/).optional()
    });
    return admin.validate(data);
}



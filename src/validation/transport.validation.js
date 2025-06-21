import Joi from "joi";

export const createTransportValidator = (data) => {
    const transport = Joi.object({
        transportType: Joi.string()
            .lowercase()
            .valid("bus", "car", "plane", "ship", "trolleybus", "metro")
            .required(),
        phoneNumber: Joi.string().regex(/^998[0-9]{9}$/).required(),   
        transportNumber: Joi.string().regex(/^(?:[1-9][0-9]{0,2}|1000)$/).required(),
        class: Joi.string().required(),
        seat: Joi.string().regex(/^(?:[1-9]|[1-4][0-9]|50)$/).required()
    });
    return transport.validate(data);
}

export const signInTransportValidator = (data) => {
    const transport = Joi.object({
        phoneNumber: Joi.string().regex(/^998[0-9]{9}$/).required(),
    });
    return transport.validate(data);
}

export const confirmSignInTransportValidator = (data) => {
    const transport = Joi.object({
        phoneNumber: Joi.string().regex(/^998[0-9]{9}$/).required(),
        otp: Joi.string().length(6).required()
    });
    return transport.validate(data);
}

export const updateTransportValidator = (data) => {
    const transport = Joi.object({
        transportType: Joi.string()
            .lowercase()
            .valid("bus", "car", "plane", "ship", "trolleybus", "metro")
            .optional(),
        transportNumber: Joi.string().regex(/^(?:[1-9][0-9]{0,2}|1000)$/).optional(),
        class: Joi.string().optional(),
        seat: Joi.string().regex(/^(?:[1-9]|[1-4][0-9]|50)$/).optional()
    });
    return transport.validate(data);
}
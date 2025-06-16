import Joi from "joi";

export const createTransportValidator = (data) => {
    const transport = Joi.object({
        transportType: Joi.string()
            .lowercase()
            .valid("bus", "car", "plane", "ship", "trolleybus", "metro")
            .required(),
        transportNumber: Joi.string().regex(/^(?:[1-9][0-9]{0,2}|1000)$/).required(),
        class: Joi.string().required(),
        seat: Joi.string().regex(/^(?:[1-9]|[1-4][0-9]|50)$/).required()
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
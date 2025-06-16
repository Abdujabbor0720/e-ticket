import Joi from "joi";

export const createTicketValidator = (data) => {
    const schema = Joi.object({
        transportId: Joi.string().min(1).required(),
        from: Joi.string().min(2).required(),
        to: Joi.string().min(2).required(),
        price: Joi.string().regex(/^\d+$/).required(),
        departure: Joi.date().required(),
        arrival: Joi.date().greater(Joi.ref('departure')).required()
    });

    return schema.validate(data);
};

export const updateTicketValidator = (data) => {
    const schema = Joi.object({
        transportId: Joi.string().min(1).optional(),
        from: Joi.string().min(2).optional(),
        to: Joi.string().min(2).optional(),
        price: Joi.string().regex(/^\d+$/).optional(),
        departure: Joi.date().optional(),
        arrival: Joi.date().greater(Joi.ref('departure')).optional()
    });

    return schema.validate(data);
}

import Joi from "joi";

export const createCustomerValidation = (data) => {
    const customer = Joi.object({
        fullName: Joi.string().required(),
        phoneNumber: Joi.string().regex(/^(?:\+998|998)?(9[0-9]{8})$/).required(),
        email: Joi.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/).required()
    });
    return customer.validate(data);
}

export const updateCustomerValidation = (data) => {
    const customer = Joi.object({
        fullName: Joi.string().optional(),
        phoneNumber: Joi.string().regex(/^(?:\+998|998)?(9[0-9]{8})$/).optional(),
        email: Joi.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/).optional()
    });
    return customer.validate(data);
}
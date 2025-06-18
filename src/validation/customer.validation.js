import Joi from "joi";

export const signUpCustomerValidation = (data) => {
    const customer = Joi.object({
        fullName: Joi.string().required(),
        phoneNumber: Joi.string().regex(/^(?:\+998|998)?([9753][0-9]{8})$/).required(),
        email: Joi.string().email().required()
    });
    return customer.validate(data);
}

export const signInCustomerValidation = (data) => {
    const customer = Joi.object({
        email: Joi.string().email().required()
    });
    return customer.validate(data);
}

export const confirmSignInCustomerValidation = (data) => {
    const customer = Joi.object({
        email: Joi.string().email().required(),
        otp: Joi.string().length(6).required()
    });
    return customer.validate(data);
}

export const updateCustomerValidation = (data) => {
    const customer = Joi.object({
        fullName: Joi.string().optional(),
        phoneNumber: Joi.string().regex(/^(?:\+998|998)?([9753][0-9]{8})$/).optional(),
        email: Joi.string().email().optional()
    });
    return customer.validate(data);
}
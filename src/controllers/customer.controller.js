import Customer from "../models/customer.model.js";
import { resError } from "../helpers/resError.js";
import { resSuccess } from "../helpers/resSuccess.js";
import {
    createCustomerValidation,
    updateCustomerValidation
} from '../validation/customer.validation.js';
import config from '../config/index.js';
import { Token } from '../utils/token-service.js';

const token = new Token();

export class CustomerController {
    async signUp(req, res) {
        try {
            const { value, error } = createCustomerValidation(req.body);
            if (error) {
                return resError(res, error, 422);
            }
            const existsPhone = await Customer.findOne({ phoneNumber: value.phoneNumber });
            if (existsPhone) {
                return resError(res, `Phone number already registered`, 409);
            }
            const customer = await Customer.create(value);
            const payload = { id: customer._id };
            const accessToken = await token.generateAccessToken(payload)
            const refreshToken = await token.generateRefreshToken(payload);
            res.cookie('refreshTokenCustomer', refreshToken, {
                httpOnly: true,
                secure: true,
                maxAge: 60 * 24 * 60 * 60 * 1000
            });
            return resSuccess(res, {
                data: customer,
                token: accessToken 
            }, 201);
        } catch (error) {
            return resError(res, error);
        }
    }
}
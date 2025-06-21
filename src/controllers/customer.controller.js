import Customer from "../models/customer.model.js";
import { resError } from "../helpers/resError.js";
import { resSuccess } from "../helpers/resSuccess.js";
import {
    confirmSignInCustomerValidation,
    signInCustomerValidation,
    signUpCustomerValidation,
    updateCustomerValidation
} from '../validation/customer.validation.js';
import config from '../config/index.js';
import { Token } from '../utils/token-service.js';
import { generateOTP } from "../helpers/generate-otp.js";
import NodeCache from "node-cache";
import { transporter } from "../helpers/send-mail.js";

const token = new Token();
const cache = new NodeCache();

export class CustomerController {
    async signUp(req, res) {
        try {
            const { value, error } = signUpCustomerValidation(req.body);
            if (error) {
                return resError(res, error, 422);
            }
            const existsPhone = await Customer.findOne({ phoneNumber: value.phoneNumber });
            if (existsPhone) {
                return resError(res, `Phone number already registered`, 409);
            }
            const existsEmail = await Customer.findOne({ email: value.email });
            if (existsEmail) {
                return resError(res, `Email already registred`);
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

    async signIn(req, res) {
        try {
            const { value, error } = signInCustomerValidation(req.body);
            if (error) {
                return resError(res, error, 422);
            }
            const email = value.email;
            const customer = await Customer.findOne({ email });
            if (!customer) {
                return resSuccess(res, `Customer not found`, 404);
            }
            const otp = generateOTP();
            const mailOptions = {
                from: config.MAIL_USER,
                to: email,
                subject: 'e-ticket',
                text: `Your OTP code is: ${otp}`
            };
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                    return resError(res, `Error on sending to email`, 400);
                } else {
                    console.log(info);
                }
            });
            cache.set(email, otp, 300);
            return resSuccess(res, {})
        } catch (error) {
            return resError(res, error);
        }
    }

    async confirmSignIn(req, res) {
        try {
            const { value, error } = confirmSignInCustomerValidation(req.body);
            if (error) {
                return resError(res, error, 422);
            }
            const customer = await Customer.findOne({ email: value.email });
            if (!customer) {
                return resError(res, `Customer not found`)
            }
            const cacheOTP = cache.get(value.email);
            if (!cacheOTP || cacheOTP != value.otp) {
                return resError(res, `OTP expired`, 400);
            }
            cache.del(value.email);
            const payload = { id: customer._id };
            const accessToken = await token.generateAccessToken(payload);
            const refreshToken = await token.generateRefreshToken(payload);
            res.cookie('refreshTokenCustomer', refreshToken, {
                httpOnly: true,
                secure: true,
                maxAge: 60 * 24 * 60 * 60 * 1000
            });
            return resSuccess(res, {
                data: customer,
                token: accessToken
            }, 200);
        } catch (error) {
            return resError(res, error);
        }
    }

    async newAccessToken(req, res) {
        try {
            const refreshToken = req.cookies?.refreshTokenCustomer;
            if (!refreshToken) {
                return resError(res, `Refresh token expired`, 400);
            }
            const decodedToken = await token.verifyToken(refreshToken, config.REFRESH_TOKEN_KEY);
            if (!decodedToken) {
                return resError(res, `Invalid token`, 400)
            }
            const customer = await Customer.findById(decodedToken.id);
            if (!customer) {
                return resError(res, `Customer not found`, 404)
            }
            const payload = { id: customer._id };
            const accessToken = await token.generateAccessToken(payload);
            return resSuccess(res, {
                token: accessToken
            });
        } catch (error) {
            return resError(res, error);
        }
    }

    async logOut(req, res) {
        try {
            const refreshToken = req.cookies?.refreshTokenCustomer;
            if (!refreshToken) {
                return resError(res, `Refresh token expired`, 400);
            }
            const decodedToken = await token.verifyToken(refreshToken, config.REFRESH_TOKEN_KEY);
            if (!decodedToken) {
                return resError(res, `Invalid token`, 400)
            }
            const customer = await Customer.findById(decodedToken.id);
            if (!customer) {
                return resError(res, `Customer not found`, 404)
            }
            res.clearCookie('refreshTokenCustomer');
            return resSuccess(res, {});
        } catch (error) {
            return resError(res, error);
        }
    }
}
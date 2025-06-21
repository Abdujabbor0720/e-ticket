import { isValidObjectId } from "mongoose";
import { resError } from "../helpers/resError.js";
import { resSuccess } from "../helpers/resSuccess.js";
import { confirmSignInTransportValidator, createTransportValidator, signInTransportValidator, updateTransportValidator } from "../validation/transport.validation.js";
import Transport from "../models/transport.model.js";
import Ticket from "../models/ticket.model.js";
import { generateOTP } from "../helpers/generate-otp.js";
import NodeCache from "node-cache";
import { sendSMS } from "../helpers/send-sms.js";
import { Token } from "../utils/token-service.js";

const cache = new NodeCache();
const token = new Token();

export class TransportController {
    async createTransport(req, res) {
        try {
            const { value, error } = createTransportValidator(req.body);
            if (error) {
                return resError(res, error, 422);
            }
            const existsPhoneNumber = await Transport.findOne({ phoneNumber: value.phoneNumber });
            if (existsPhoneNumber) {
                return resError(res, `This transport already exists`, 409);
            }
            const newTransport = await Transport.create(value);
            return resSuccess(res, newTransport, 201);
        } catch (error) {
            return resError(res, error);
        }
    }

    async signInTransport(req, res) {
        try {
            const { value, error } = signInTransportValidator(req.body);
            if (error) {
                console.log("Validator error:", error)
                return resError(res, error, 422);
            }
            const { phoneNumber } = value;
            const transport = await Transport.findOne({ phoneNumber });
            if (!transport) {
                return resError(res, `Transport not found`, 404);
            }
            const otp = generateOTP();
            cache.set(phoneNumber, otp, 120);
            const sms = "Sizning tasdiqlash kodingiz: " + otp;
            await sendSMS(phoneNumber, sms);
            return resSuccess(res, {});
        } catch (error) {
            return resError(res, error);
        }
    }

    async confirmSignInTransport(req, res) {
        try {
            const { value, error } = confirmSignInTransportValidator(req.body);
            if (error) {
                return resError(res, error, 422);
            }
            const transport = await Transport.findOne({ phoneNumber: value.phoneNumber });
            if (!transport) {
                return resError(res, `Transport not found`, 404);
            }
            const cacheOTP = cache.get(value.phoneNumber);
            if (!cacheOTP || cacheOTP != value.otp) {
                return resError(res, `OTP expired`, 400);
            }
            cache.del(value.phoneNumber);
            const payload = { id: transport._id };
            const accessToken = await token.generateAccessToken(payload);
            const refreshtoken = await token.generateRefreshToken(payload);
            res.cookie('refreshTokenTransport', refreshtoken, {
                httpOnly: true,
                secure: true,
                maxAge: 60 * 24 * 60 * 60 * 1000
            });
            return resSuccess(res, {
                data: transport,
                token: accessToken
            });
        } catch (error) {
            return resError(res, error);
        }
    }

    async getAllTransports(_, res) {
        try {
            const transports = await Transport.find();
            return resSuccess(res, transports);
        } catch (error) {
            return resError(res, error);
        }
    }

    async getTransportById(req, res) {
        try {
            const transport = await TransportController.findTransportById(res, req.params.id);
            return resSuccess(res, transport);
        } catch (error) {
            return resError(res, error);
        }
    }

    async updateTransportById(req, res) {
        try {
            const { value, error } = updateTransportValidator(req.body);
            if (error) {
                return resError(res, error, 422);
            }
            await TransportController.findTransportById(res, req.params.id);
            const updatedTransport = await Transport.findByIdAndUpdate(req.params.id, value, { new: true });
            return resSuccess(res, updatedTransport);
        } catch (error) {
            return resError(res, error);
        }
    }

    async deleteTransportById(req, res) {
        try {
            const id = req.params.id;
            await TransportController.findTransportById(res, id);
            await Transport.findByIdAndDelete(id);
            await Ticket.deleteMany({ transportId: id });
            return resSuccess(res, { message: `Transport deleted successfully` });
        } catch (error) {
            return resError(res, error);
        }
    }

    static async findTransportById(res, id) {
        try {
            if (!isValidObjectId(id)) {
                return resError(res, `Invalid object ID`, 400);
            }
            const transport = await Transport.findById(id).populate('tickets');
            if (!transport) {
                return resError(res, `Transport not found`, 404);
            }
            return transport;
        } catch (error) {
            return resError(res, error);
        }
    }
}
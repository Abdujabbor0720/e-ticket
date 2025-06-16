import { isValidObjectId } from "mongoose";
import { resError } from "../helpers/resError.js";
import { resSuccess } from "../helpers/resSuccess.js";
import { createTransportValidator, updateTransportValidator } from "../validation/transport.validation.js";
import Transport from "../models/transport.model.js";
import Ticket from "../models/ticket.model.js";

export class TransportController {
    async createTransport(req, res) {
        try {
            const { value, error } = createTransportValidator(req.body);
            if (error) {
                return resError(res, error, 422);
            }
            const existsTransportNumber = await Transport.findOne({ transportNumber: value.transportNumber });
            if (existsTransportNumber) {
                return resError(res, `This transport already exists`, 409);
            }
            const newTransport = await Transport.create(value);
            return resSuccess(res, newTransport, 201);
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
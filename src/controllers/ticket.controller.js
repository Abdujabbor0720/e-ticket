import Ticket from '../models/ticket.model.js';
import Transport from '../models/transport.model.js';
import { resError } from '../helpers/resError.js';
import { resSuccess } from '../helpers/resSuccess.js';
import { createTicketValidator, updateTicketValidator } from '../validation/ticket.validation.js';
import { isValidObjectId } from 'mongoose';
import { updateTransportValidator } from '../validation/transport.validation.js';

export class TicketController {
    async createTicket(req, res) {
        try {
            const { value, error } = createTicketValidator(req.body);
            if (error) {
                return resError(res, error, 422);
            }
            if (!isValidObjectId(value.transportId)) {
                return resError(res, `Invalid ObjectId`, 400);
            }
            const existsTransport = await Transport.findById(value.transportId);
            if (!existsTransport) {
                return resError(res, `Transport is not defined`, 404);
            }
            const newTicket = await Ticket.create(value);
            return resSuccess(res, newTicket);
        } catch (error) {
            return resError(res, error);
        }
    }

    async getAllTickets(_, res) {
        try {
            const tickets = await Ticket.find().populate('transportId');
            return resSuccess(res, tickets);
        } catch (error) {
            return resError(res, error);
        }
    }

    async getTicketById(req, res) {
        try {
            const ticket = await TicketController.findTicketById(res, req.params.id);
            return resSuccess(res, ticket);
        } catch (error) {
            return resError(res, error);
        }
    }

    async updateTicketById(req, res) {
        try {
            const id = req.params.id;
            await TicketController.findTicketById(res, id);
            const { value, error } = updateTicketValidator(req.body);
            if (error) {
                return resError(res, error, 422);
            }
            if (value.transportId) {
                if (!isValidObjectId(value.transportId)) {
                    return resError(res, `Invalid transport ID`, 400);
                }
                const existsTransport = await Transport.findById(value.transportId);
                if (!existsTransport) {
                    return resError(res, `Transport is not defined`, 400);
                }
            }
            const updatedTicket = await Ticket.findByIdAndUpdate(id, value, { new: true });
            return resSuccess(res, updatedTicket);
        } catch (error) {
            return resError(res, error);
        }
    }

    async deleteTicketById(req, res) {
        try {
            const id = req.params.id;
            await TicketController.findTicketById(res, id);
            await Ticket.findByIdAndDelete(id);
            return resSuccess(res, { message: `Ticket successfully deleted` });
        } catch (error) {
            return resError(res, error);
        }
    }

    static async findTicketById(res, id) {
        try {
            if (!isValidObjectId(id)) {
                return resError(res, `Invalid ObjectId`, 400);
            }
            const ticket = await Ticket.findById(id).populate('transportId');
            if (!ticket) {
                return resError(res, 'Ticket not found', 404);
            }
            return ticket;
        } catch (error) {
            return resError(res, error);
        }
    }
}
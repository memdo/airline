"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPassengerList = exports.checkIn = exports.buyTicket = void 0;
const ticket_service_1 = require("../services/ticket.service");
const response_1 = require("../utils/response");
const ticketService = new ticket_service_1.TicketService();
const buyTicket = async (req, res, next) => {
    try {
        const authReq = req;
        const dto = req.body;
        const tickets = await ticketService.buyTickets(dto, authReq.user.id);
        res.status(201).json((0, response_1.successResponse)({ tickets }, 'Biletler başarıyla satın alındı.'));
    }
    catch (error) {
        if (error.message === 'Uçuşta yeterli yer yok.') {
            return res.status(409).json((0, response_1.soldOutResponse)(error.message));
        }
        next(error);
    }
};
exports.buyTicket = buyTicket;
const checkIn = async (req, res, next) => {
    try {
        const dto = req.body;
        const result = await ticketService.checkIn(dto);
        res.json((0, response_1.successResponse)(result, 'Check-in işlemi başarılı.'));
    }
    catch (error) {
        next(error);
    }
};
exports.checkIn = checkIn;
const getPassengerList = async (req, res, next) => {
    try {
        const { flightNumber } = req.params;
        const dto = req.query;
        const result = await ticketService.getPassengerList(flightNumber, dto);
        res.json((0, response_1.successResponse)(result));
    }
    catch (error) {
        next(error);
    }
};
exports.getPassengerList = getPassengerList;

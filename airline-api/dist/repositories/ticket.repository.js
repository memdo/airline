"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketRepository = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
class TicketRepository {
    async create(data) {
        return prisma_1.default.ticket.create({ data });
    }
    async findByIdWithFlight(id) {
        return prisma_1.default.ticket.findUnique({
            where: { id },
            include: { flight: true }
        });
    }
    async findByTicketNumberWithFlight(ticketNumber) {
        return prisma_1.default.ticket.findUnique({
            where: { ticketNumber },
            include: { flight: true }
        });
    }
    async findByFlightAndName(flightId, firstName, lastName) {
        return prisma_1.default.ticket.findFirst({
            where: {
                flightId,
                firstName,
                lastName
            }
        });
    }
    async updateCheckIn(id, isCheckedIn) {
        return prisma_1.default.ticket.update({
            where: { id },
            data: { isCheckedIn }
        });
    }
    async findManyByFlight(flightId, skip = 0, take = 10) {
        return prisma_1.default.ticket.findMany({
            where: { flightId },
            skip,
            take,
            orderBy: { seatNumber: 'asc' }
        });
    }
    async countByFlight(flightId) {
        return prisma_1.default.ticket.count({
            where: { flightId }
        });
    }
}
exports.TicketRepository = TicketRepository;

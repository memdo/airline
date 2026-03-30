"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlightRepository = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
class FlightRepository {
    async create(data) {
        return prisma_1.default.flight.create({ data });
    }
    async createMany(data) {
        return prisma_1.default.flight.createMany({ data });
    }
    async findMany(where, skip = 0, take = 10) {
        return prisma_1.default.flight.findMany({
            where,
            skip,
            take,
            orderBy: { dateFrom: 'asc' }
        });
    }
    async count(where) {
        return prisma_1.default.flight.count({ where });
    }
    async findByNumberAndDate(flightNumber, dateInput) {
        const startOfDay = new Date(dateInput);
        startOfDay.setUTCHours(0, 0, 0, 0);
        const endOfDay = new Date(dateInput);
        endOfDay.setUTCHours(23, 59, 59, 999);
        return prisma_1.default.flight.findFirst({
            where: {
                flightNumber,
                dateFrom: {
                    gte: startOfDay,
                    lte: endOfDay
                }
            }
        });
    }
    async findById(id) {
        return prisma_1.default.flight.findUnique({
            where: { id }
        });
    }
    async updateAvailableSeats(id, count) {
        return prisma_1.default.flight.update({
            where: { id },
            data: {
                availableSeats: {
                    decrement: count
                }
            }
        });
    }
}
exports.FlightRepository = FlightRepository;

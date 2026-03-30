"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketService = void 0;
const ticket_repository_1 = require("../repositories/ticket.repository");
const flight_repository_1 = require("../repositories/flight.repository");
const error_middleware_1 = require("../middleware/error.middleware");
const ticketRepository = new ticket_repository_1.TicketRepository();
const flightRepository = new flight_repository_1.FlightRepository();
class TicketService {
    async buyTickets(dto, purchaserId) {
        const flight = await flightRepository.findByNumberAndDate(dto.flightNumber, new Date(dto.date));
        if (!flight) {
            throw new error_middleware_1.AppError('Belirtilen uçuş bulunamadı.', 404);
        }
        if (flight.availableSeats < dto.passengerNames.length) {
            throw new error_middleware_1.AppError('Uçuşta yeterli yer yok.', 409);
        }
        const tickets = [];
        let currentAvailable = flight.availableSeats;
        for (const name of dto.passengerNames) {
            // Split name: last part is lastName, others are firstName
            const nameParts = name.trim().split(' ');
            const lastName = nameParts.length > 1 ? nameParts.pop() : '';
            const firstName = nameParts.join(' ') || 'Unknown';
            const seatNumber = flight.capacity - currentAvailable + 1;
            const ticketNumber = `TKT-${dto.date.replace(/-/g, '')}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
            const ticket = await ticketRepository.create({
                ticketNumber,
                firstName,
                lastName,
                seatNumber,
                flightId: flight.id,
                purchasedById: purchaserId
            });
            tickets.push({
                id: ticket.id.toString(), // Return as string as per request
                ticketNumber: ticket.ticketNumber,
                passengerName: `${ticket.firstName} ${ticket.lastName}`.trim(),
                seatNumber: ticket.seatNumber,
                flightNumber: flight.flightNumber,
                date: dto.date
            });
            currentAvailable--;
        }
        // Update flight available seats
        await flightRepository.updateAvailableSeats(flight.id, dto.passengerNames.length);
        return tickets;
    }
    async checkIn(dto) {
        const ticket = await ticketRepository.findByTicketNumberWithFlight(dto.ticketNumber);
        if (!ticket) {
            throw new error_middleware_1.AppError('Bilet bulunamadı.', 404);
        }
        // Security Check: Match ID + FlightNumber + LastName
        const flightMatches = ticket.flight.flightNumber === dto.flightNumber;
        const nameMatches = ticket.lastName.toLowerCase() === dto.lastName.toLowerCase();
        // Check if the flight date matches the provided date (ignoring time)
        const flightDateStr = ticket.flight.dateFrom.toISOString().split('T')[0];
        const dateMatches = flightDateStr === dto.date;
        if (!flightMatches || !nameMatches) {
            throw new error_middleware_1.AppError('Güvenlik doğrulaması başarısız. Bilgileri kontrol edin.', 403);
        }
        if (!dateMatches) {
            throw new error_middleware_1.AppError('Tarih uyuşmazlığı. Biletiniz bu tarihteki uçuşa ait değil.', 400);
        }
        if (ticket.isCheckedIn) {
            throw new error_middleware_1.AppError('Zaten check-in yapılmış.', 409);
        }
        const updatedTicket = await ticketRepository.updateCheckIn(ticket.id, true);
        return {
            passengerName: `${updatedTicket.firstName} ${updatedTicket.lastName}`.trim(),
            seatNumber: updatedTicket.seatNumber
        };
    }
    async getPassengerList(flightNumber, dto) {
        const flight = await flightRepository.findByNumberAndDate(flightNumber, new Date(dto.date));
        if (!flight) {
            throw new error_middleware_1.AppError('Uçuş bulunamadı.', 404);
        }
        const page = dto.page || 1;
        const pageSize = 10;
        const skip = (page - 1) * pageSize;
        const passengers = await ticketRepository.findManyByFlight(flight.id, skip, pageSize);
        const totalPassengers = await ticketRepository.countByFlight(flight.id);
        return {
            flightNumber,
            date: dto.date,
            page: Number(page),
            pageSize,
            totalPassengers,
            passengers: passengers.map(t => ({
                passengerName: `${t.firstName} ${t.lastName}`.trim(),
                seatNumber: t.seatNumber,
                isCheckedIn: t.isCheckedIn
            }))
        };
    }
}
exports.TicketService = TicketService;

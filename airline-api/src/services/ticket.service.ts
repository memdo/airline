import { TicketRepository } from '../repositories/ticket.repository';
import { FlightRepository } from '../repositories/flight.repository';
import { AppError } from '../middleware/error.middleware';
import { BuyTicketDto, CheckInDto, PassengerListDto } from '../dtos/ticket.dto';

const ticketRepository = new TicketRepository();
const flightRepository = new FlightRepository();

export class TicketService {
  async buyTickets(dto: BuyTicketDto, purchaserId: number) {
    const flight = await flightRepository.findByNumberAndDate(dto.flightNumber, new Date(dto.date));
    
    if (!flight) {
      throw new AppError('Belirtilen uçuş bulunamadı.', 404);
    }

    if (flight.availableSeats < dto.passengerNames.length) {
      throw new AppError('Uçuşta yeterli yer yok.', 409);
    }

    const tickets: any[] = [];
    let currentAvailable = flight.availableSeats;

    for (const name of dto.passengerNames) {
      // Split name: last part is lastName, others are firstName
      const nameParts = name.trim().split(' ');
      const lastName = nameParts.length > 1 ? nameParts.pop()! : '';
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

  async checkIn(dto: CheckInDto) {
    const ticket = await ticketRepository.findByTicketNumberWithFlight(dto.ticketNumber);
    
    if (!ticket) {
      throw new AppError('Bilet bulunamadı.', 404);
    }

    if (!dto.date) {
      throw new AppError('Tarih (date) parametresi zorunludur.', 400);
    }

    // Check if the flight date matches the provided date (ignoring time)
    const flightDateStr = ticket.flight.dateFrom.toISOString().split('T')[0];
    const dateMatches = flightDateStr === dto.date.trim();

    if (!dateMatches) {
      throw new AppError('Tarih uyuşmazlığı. Biletiniz bu tarihteki uçuşa ait değil.', 400);
    }

    // Security Check: Match ID + FlightNumber + LastName
    const flightMatches = ticket.flight.flightNumber === dto.flightNumber;
    const nameMatches = ticket.lastName.toLowerCase() === dto.lastName.toLowerCase();

    if (!flightMatches || !nameMatches) {
      throw new AppError('Güvenlik doğrulaması başarısız. Bilgileri kontrol edin.', 403);
    }

    if (ticket.isCheckedIn) {
      throw new AppError('Zaten check-in yapılmış.', 409);
    }

    const updatedTicket = await ticketRepository.updateCheckIn(ticket.id, true);

    return {
      passengerName: `${updatedTicket.firstName} ${updatedTicket.lastName}`.trim(),
      seatNumber: updatedTicket.seatNumber
    };
  }

  async getPassengerList(flightNumber: string, dto: PassengerListDto) {
    const flight = await flightRepository.findByNumberAndDate(flightNumber, new Date(dto.date));
    if (!flight) {
      throw new AppError('Uçuş bulunamadı.', 404);
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

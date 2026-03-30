import prisma from '../config/prisma';
import { Ticket, Prisma } from '@prisma/client';

export class TicketRepository {
  async create(data: Prisma.TicketUncheckedCreateInput) {
    return prisma.ticket.create({ data });
  }

  async findByIdWithFlight(id: number) {
    return prisma.ticket.findUnique({
      where: { id },
      include: { flight: true }
    });
  }

  async findByTicketNumberWithFlight(ticketNumber: string) {
    return prisma.ticket.findUnique({
      where: { ticketNumber },
      include: { flight: true }
    });
  }

  async findByFlightAndName(flightId: number, firstName: string, lastName: string) {
    return prisma.ticket.findFirst({
      where: {
        flightId,
        firstName,
        lastName
      }
    });
  }

  async updateCheckIn(id: number, isCheckedIn: boolean) {
    return prisma.ticket.update({
      where: { id },
      data: { isCheckedIn }
    });
  }

  async findManyByFlight(flightId: number, skip: number = 0, take: number = 10) {
    return prisma.ticket.findMany({
      where: { flightId },
      skip,
      take,
      orderBy: { seatNumber: 'asc' }
    });
  }

  async countByFlight(flightId: number) {
    return prisma.ticket.count({
      where: { flightId }
    });
  }
}

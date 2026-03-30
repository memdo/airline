import prisma from '../config/prisma';
import { Flight, Prisma } from '@prisma/client';

export class FlightRepository {
  async create(data: Prisma.FlightCreateInput) {
    return prisma.flight.create({ data });
  }

  async createMany(data: Prisma.FlightCreateManyInput[]) {
    return prisma.flight.createMany({ data });
  }

  async findMany(where: Prisma.FlightWhereInput, skip: number = 0, take: number = 10) {
    return prisma.flight.findMany({
      where,
      skip,
      take,
      orderBy: { dateFrom: 'asc' }
    });
  }

  async count(where: Prisma.FlightWhereInput) {
    return prisma.flight.count({ where });
  }

  async findByNumberAndDate(flightNumber: string, dateInput: Date) {
    const startOfDay = new Date(dateInput);
    startOfDay.setUTCHours(0, 0, 0, 0);
    
    const endOfDay = new Date(dateInput);
    endOfDay.setUTCHours(23, 59, 59, 999);

    return prisma.flight.findFirst({
      where: {
        flightNumber,
        dateFrom: {
          gte: startOfDay,
          lte: endOfDay
        }
      }
    });
  }

  async findById(id: number) {
    return prisma.flight.findUnique({
      where: { id }
    });
  }

  async updateAvailableSeats(id: number, count: number) {
    return prisma.flight.update({
      where: { id },
      data: {
        availableSeats: {
          decrement: count
        }
      }
    });
  }
}

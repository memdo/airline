import { FlightRepository } from '../repositories/flight.repository';
import { AppError } from '../middleware/error.middleware';
import { parse } from 'csv-parse/sync';
import { AddFlightDto, QueryFlightDto } from '../dtos/flight.dto';

const flightRepository = new FlightRepository();

export class FlightService {
  async addFlight(dto: AddFlightDto) {
    const existing = await flightRepository.findByNumberAndDate(dto.flightNumber, new Date(dto.dateFrom));
    if (existing) {
      throw new AppError('Bu uçuş zaten eklenmiş.', 409);
    }

    return flightRepository.create({
      flightNumber: dto.flightNumber,
      dateFrom: new Date(dto.dateFrom),
      dateTo: new Date(dto.dateTo),
      airportFrom: dto.airportFrom,
      airportTo: dto.airportTo,
      durationMinutes: Number(dto.duration),
      capacity: Number(dto.capacity),
      availableSeats: Number(dto.capacity)
    });
  }

  async addFlightsFromFile(fileContent: string) {
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });

    let successCount = 0;
    let failureCount = 0;
    const errors: any[] = [];

    for (const record of records) {
      try {
        await this.addFlight(record as AddFlightDto);
        successCount++;
      } catch (err: any) {
        failureCount++;
        errors.push({ flight: record.flightNumber, error: err.message });
      }
    }

    return {
      totalProcessed: records.length,
      successCount,
      failureCount,
      errors
    };
  }

  async queryFlights(dto: QueryFlightDto) {
    const {
      dateFrom,
      dateTo,
      airportFrom,
      airportTo,
      numberOfPeople,
      oneWay = true,
      page = 1
    } = dto;

    const pageSize = 10;
    const skip = (Number(page) - 1) * pageSize;

    const where: any = {
      dateFrom: { gte: new Date(dateFrom) },
      dateTo: { lte: new Date(dateTo) },
      airportFrom,
      airportTo,
      availableSeats: { gte: Number(numberOfPeople) }
    };

    const flights = await flightRepository.findMany(where, skip, pageSize);
    const totalCount = await flightRepository.count(where);

    // If round trip, we could potentially look for return flights too,
    // but the assignment says "list of available flights (Flight number, duration)".
    // A simple implementation follows the direct parameters.

    return {
      page: Number(page),
      pageSize,
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
      flights: flights.map(f => ({
        flightNumber: f.flightNumber,
        dateFrom: f.dateFrom,
        dateTo: f.dateTo,
        airportFrom: f.airportFrom,
        airportTo: f.airportTo,
        duration: f.durationMinutes,
        availableSeats: f.availableSeats
      }))
    };
  }
}

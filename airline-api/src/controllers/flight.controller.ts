import { Request, Response, NextFunction } from 'express';
import { FlightService } from '../services/flight.service';
import { successResponse } from '../utils/response';
import { AddFlightDto, QueryFlightDto, UploadFlightsDto } from '../dtos/flight.dto';

const flightService = new FlightService();

export const addFlight = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dto: AddFlightDto = req.body;
    const flight = await flightService.addFlight(dto);
    res.status(201).json(successResponse({ flight }, 'Uçuş başarıyla eklendi.'));
  } catch (error) {
    next(error);
  }
};

export const queryFlights = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dto = req.query as unknown as QueryFlightDto;
    const result = await flightService.queryFlights(dto);
    res.json(successResponse(result));
  } catch (error) {
    next(error);
  }
};

export const uploadFlights = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dto: UploadFlightsDto = req.body;
    const result = await flightService.addFlightsFromFile(dto.csvData);
    res.json(successResponse(result, 'Dosya işlendi.'));
  } catch (error) {
    next(error);
  }
};

import { Request, Response, NextFunction } from 'express';
import { TicketService } from '../services/ticket.service';
import { successResponse, errorResponse, soldOutResponse } from '../utils/response';
import { AuthRequest } from '../middleware/auth.middleware';
import { BuyTicketDto, CheckInDto, PassengerListDto } from '../dtos/ticket.dto';

const ticketService = new TicketService();

export const buyTicket = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authReq = req as AuthRequest;
    const dto: BuyTicketDto = req.body;
    const tickets = await ticketService.buyTickets(dto, authReq.user!.id);
    res.status(201).json(successResponse({ tickets }, 'Biletler başarıyla satın alındı.'));
  } catch (error: any) {
    if (error.message === 'Uçuşta yeterli yer yok.') {
      return res.status(409).json(soldOutResponse(error.message));
    }
    next(error);
  }
};

export const checkIn = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dto: CheckInDto = req.body;
    const result = await ticketService.checkIn(dto);
    res.json(successResponse(result, 'Check-in işlemi başarılı.'));
  } catch (error) {
    next(error);
  }
};

export const getPassengerList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { flightNumber } = req.params;
    const dto = req.query as unknown as PassengerListDto;
    const result = await ticketService.getPassengerList(flightNumber, dto);
    res.json(successResponse(result));
  } catch (error) {
    next(error);
  }
};

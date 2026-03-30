export interface BuyTicketDto {
  flightNumber: string;
  date: string;
  passengerNames: string[];
}

export interface CheckInDto {
  ticketNumber: string;
  flightNumber: string;
  lastName: string;
  date: string;
}

export interface PassengerListDto {
  date: string;
  page?: number;
}

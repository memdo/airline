export interface AddFlightDto {
  flightNumber: string;
  dateFrom: string;
  dateTo: string;
  airportFrom: string;
  airportTo: string;
  duration: number;
  capacity: number;
}

export interface QueryFlightDto {
  dateFrom: string;
  dateTo: string;
  airportFrom: string;
  airportTo: string;
  numberOfPeople: number;
  oneWay?: boolean;
  page?: number;
}

export interface UploadFlightsDto {
  csvData: string;
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFlights = exports.queryFlights = exports.addFlight = void 0;
const flight_service_1 = require("../services/flight.service");
const response_1 = require("../utils/response");
const flightService = new flight_service_1.FlightService();
const addFlight = async (req, res, next) => {
    try {
        const dto = req.body;
        const flight = await flightService.addFlight(dto);
        res.status(201).json((0, response_1.successResponse)({ flight }, 'Uçuş başarıyla eklendi.'));
    }
    catch (error) {
        next(error);
    }
};
exports.addFlight = addFlight;
const queryFlights = async (req, res, next) => {
    try {
        const dto = req.query;
        const result = await flightService.queryFlights(dto);
        res.json((0, response_1.successResponse)(result));
    }
    catch (error) {
        next(error);
    }
};
exports.queryFlights = queryFlights;
const uploadFlights = async (req, res, next) => {
    try {
        const dto = req.body;
        const result = await flightService.addFlightsFromFile(dto.csvData);
        res.json((0, response_1.successResponse)(result, 'Dosya işlendi.'));
    }
    catch (error) {
        next(error);
    }
};
exports.uploadFlights = uploadFlights;

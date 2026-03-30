"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerSpec = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Airline Ticketing System API',
            version: '1.0.0',
            description: 'SE4458 Midterm Project - Airline API',
        },
        servers: [
            {
                url: process.env.APP_URL || 'http://localhost:3001',
                description: process.env.APP_URL ? 'Production server' : 'Local development server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            schemas: {
                RegisterDto: {
                    type: 'object',
                    required: ['username', 'password'],
                    properties: {
                        username: { type: 'string', example: 'newUser' },
                        password: { type: 'string', example: 'secret123' },
                        role: { type: 'string', example: 'user' }
                    }
                },
                LoginDto: {
                    type: 'object',
                    required: ['username', 'password'],
                    properties: {
                        username: { type: 'string', example: 'newUser' },
                        password: { type: 'string', example: 'secret123' }
                    }
                },
                AddFlightDto: {
                    type: 'object',
                    required: ['flightNumber', 'dateFrom', 'dateTo', 'airportFrom', 'airportTo', 'duration', 'capacity'],
                    properties: {
                        flightNumber: { type: 'string', example: 'TK101' },
                        dateFrom: { type: 'string', format: 'date-time', example: '2023-12-01T10:00:00Z' },
                        dateTo: { type: 'string', format: 'date-time', example: '2023-12-01T12:00:00Z' },
                        airportFrom: { type: 'string', example: 'IST' },
                        airportTo: { type: 'string', example: 'JFK' },
                        duration: { type: 'number', example: 120 },
                        capacity: { type: 'number', example: 150 }
                    }
                },
                UploadFlightsDto: {
                    type: 'object',
                    required: ['csvData'],
                    properties: {
                        csvData: { type: 'string', example: 'flightNumber,dateFrom,dateTo,airportFrom,airportTo,duration,capacity\nTK102,2023-12-02T10:00:00Z,2023-12-02T12:00:00Z,IST,JFK,120,150' }
                    }
                },
                BuyTicketDto: {
                    type: 'object',
                    required: ['flightNumber', 'date', 'passengerNames'],
                    properties: {
                        flightNumber: { type: 'string', example: 'TK101' },
                        date: { type: 'string', format: 'date', example: '2023-12-01' },
                        passengerNames: {
                            type: 'array',
                            items: { type: 'string' },
                            example: ['John Doe', 'Jane Doe']
                        }
                    }
                },
                CheckInDto: {
                    type: 'object',
                    required: ['ticketNumber', 'flightNumber', 'lastName', 'date'],
                    properties: {
                        ticketNumber: { type: 'string', example: 'TKT-20231201-1234' },
                        flightNumber: { type: 'string', example: 'TK101' },
                        lastName: { type: 'string', example: 'Doe' },
                        date: { type: 'string', format: 'date', example: '2023-12-01' }
                    }
                }
            }
        },
    },
    apis: ['./src/routes/*.ts', './src/controllers/*.ts'], // Path to the API docs
};
exports.swaggerSpec = (0, swagger_jsdoc_1.default)(options);

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.flightQueryRateLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const response_1 = require("../utils/response");
exports.flightQueryRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 24 * 60 * 60 * 1000, // 24 hours
    max: 3, // limit each IP to 3 requests per windowMs
    message: (0, response_1.errorResponse)('Günde en fazla 3 uçuş sorgulaması yapabilirsiniz.', 429),
    standardHeaders: true,
    legacyHeaders: false,
});

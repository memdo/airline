"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.soldOutResponse = exports.errorResponse = exports.successResponse = void 0;
const successResponse = (data = {}, message) => {
    return {
        status: 'success',
        message,
        ...data
    };
};
exports.successResponse = successResponse;
const errorResponse = (message, code = 400) => {
    return {
        status: 'error',
        message
    };
};
exports.errorResponse = errorResponse;
const soldOutResponse = (message) => {
    return {
        status: 'sold_out',
        message
    };
};
exports.soldOutResponse = soldOutResponse;

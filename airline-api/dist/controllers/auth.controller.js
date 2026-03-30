"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const auth_service_1 = require("../services/auth.service");
const response_1 = require("../utils/response");
const authService = new auth_service_1.AuthService();
const register = async (req, res, next) => {
    try {
        const dto = req.body;
        const user = await authService.register(dto);
        res.status(201).json((0, response_1.successResponse)({ user }, 'Kullanıcı başarıyla oluşturuldu.'));
    }
    catch (error) {
        next(error);
    }
};
exports.register = register;
const login = async (req, res, next) => {
    try {
        const dto = req.body;
        const result = await authService.login(dto);
        res.json((0, response_1.successResponse)(result, 'Giriş başarılı.'));
    }
    catch (error) {
        next(error);
    }
};
exports.login = login;

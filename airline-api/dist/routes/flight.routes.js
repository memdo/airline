"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const flightController = __importStar(require("../controllers/flight.controller"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
/**
 * @openapi
 * /api/v1/flights:
 *   post:
 *     summary: Yeni uçuş ekle
 *     tags: [Flight]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [flightNumber, dateFrom, dateTo, airportFrom, airportTo, duration, capacity]
 *             properties:
 *               flightNumber:
 *                 type: string
 *               dateFrom:
 *                 type: string
 *                 format: date-time
 *               dateTo:
 *                 type: string
 *                 format: date-time
 *               airportFrom:
 *                 type: string
 *               airportTo:
 *                 type: string
 *               duration:
 *                 type: number
 *               capacity:
 *                 type: number
 *     responses:
 *       201:
 *         description: Uçuş başarıyla eklendi.
 *       403:
 *         description: Yetkisiz erişim (Admin gerekli).
 */
router.post('/', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(['admin']), flightController.addFlight);
/**
 * @openapi
 * /api/v1/flights:
 *   get:
 *     summary: Uçuş sorgula
 *     tags: [Flight]
 *     description: Günde 3 çağrı sınırı vardır.
 *     parameters:
 *       - in: query
 *         name: dateFrom
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: dateTo
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: airportFrom
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: airportTo
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: numberOfPeople
 *         required: true
 *         schema:
 *           type: number
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *           default: 1
 *       - in: query
 *         name: oneWay
 *         description: "Tek yön (true) veya gidiş-dönüş (false) uçuş aramak için. (Şu an tüm uçuşlar tek yönlüdür)"
 *         schema:
 *           type: boolean
 *           default: true
 *     responses:
 *       200:
 *         description: Uygun uçuşların listesi.
 */
router.get('/', flightController.queryFlights);
/**
 * @openapi
 * /api/v1/flights/upload:
 *   post:
 *     summary: Dosyadan toplu uçuş yükle (CSV)
 *     tags: [Flight]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [csvData]
 *             properties:
 *               csvData:
 *                 type: string
 *                 description: CSV içeriği string olarak.
 *     responses:
 *       200:
 *         description: Dosya işlendi.
 */
router.post('/upload', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(['admin']), flightController.uploadFlights);
exports.default = router;

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
const ticketController = __importStar(require("../controllers/ticket.controller"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
/**
 * @openapi
 * /api/v1/tickets:
 *   post:
 *     summary: Bilet satın al
 *     tags: [Ticket]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [flightNumber, date, passengerNames]
 *             properties:
 *               flightNumber:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               passengerNames:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: "Yolcu tam isimleri (Ad Soyad)"
 *     responses:
 *       201:
 *         description: Biletler başarıyla satın alındı (id ile döner).
 *       409:
 *         description: Uçuşta yeterli yer yok (sold_out).
 */
router.post('/', auth_middleware_1.authenticate, ticketController.buyTicket);
/**
 * @openapi
 * /api/v1/tickets/checkin:
 *   patch:
 *     summary: Güvenli yolcu check-in işlemi
 *     tags: [Ticket]
 *     description: "Ek güvenlik için ticketId, flightNumber ve lastName doğrulanır."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [ticketNumber, flightNumber, lastName]
 *             properties:
 *               ticketNumber:
 *                 type: string
 *                 description: "Bilet numarası (örn: TKT-20260328-0912)"
 *               flightNumber:
 *                 type: string
 *               lastName:
 *                 type: string
 *                 description: "Bilet alırken girilen isimdeki son kelime."
 *     responses:
 *       200:
 *         description: Check-in işlemi başarılı.
 *       403:
 *         description: Güvenlik doğrulaması başarısız (ID/Uçuş/Soyadı uyuşmazlığı).
 *       404:
 *         description: Bilet bulunamadı.
 */
router.patch('/checkin', ticketController.checkIn);
/**
 * @openapi
 * /api/v1/tickets/flights/{flightNumber}/passengers:
 *   get:
 *     summary: Uçuş yolcu listesi
 *     tags: [Ticket]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: flightNumber
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *           default: 1
 *     responses:
 *       200:
 *         description: Yolcu listesi.
 *       403:
 *         description: Yetkisiz erişim (Admin gerekli).
 */
router.get('/flights/:flightNumber/passengers', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(['admin']), ticketController.getPassengerList);
exports.default = router;

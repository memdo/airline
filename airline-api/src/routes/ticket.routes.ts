import { Router } from 'express';
import * as ticketController from '../controllers/ticket.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

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
router.post(
  '/',
  authenticate,
  ticketController.buyTicket
);

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
 *             required: [ticketNumber, flightNumber, lastName, date]
 *             properties:
 *               ticketNumber:
 *                 type: string
 *                 description: "Bilet numarası (örn: TKT-20260328-0912)"
 *               flightNumber:
 *                 type: string
 *               lastName:
 *                 type: string
 *                 description: "Bilet alırken girilen isimdeki son kelime."
 *               date:
 *                 type: string
 *                 format: date
 *                 description: "Uçuş tarihi (YYYY-MM-DD)"
 *     responses:
 *       200:
 *         description: Check-in işlemi başarılı.
 *       400:
 *         description: Hatalı istek (Örn. Tarih uyuşmazlığı veya eksik parametre).
 *       403:
 *         description: Güvenlik doğrulaması başarısız (ID/Uçuş/Soyadı uyuşmazlığı).
 *       404:
 *         description: Bilet bulunamadı.
 *       409:
 *         description: Zaten check-in yapılmış.
 */
router.patch(
  '/checkin',
  ticketController.checkIn
);

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
router.get(
  '/flights/:flightNumber/passengers',
  authenticate,
  authorize(['admin']),
  ticketController.getPassengerList
);

export default router;

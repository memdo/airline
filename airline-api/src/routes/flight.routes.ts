import { Router } from 'express';
import * as flightController from '../controllers/flight.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

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
router.post(
  '/',
  authenticate,
  authorize(['admin']),
  flightController.addFlight
);

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
router.get(
  '/',
  flightController.queryFlights
);

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
router.post(
  '/upload',
  authenticate,
  authorize(['admin']),
  flightController.uploadFlights
);

export default router;

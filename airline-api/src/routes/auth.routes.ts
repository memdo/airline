import { Router } from 'express';
import * as authController from '../controllers/auth.controller';

const router = Router();

/**
 * @openapi
 * /api/v1/auth/register:
 *   post:
 *     summary: Yeni kullanıcı kaydı
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, password]
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [admin, user]
 *                 default: user
 *     responses:
 *       201:
 *         description: Kullanıcı başarıyla oluşturuldu.
 *       409:
 *         description: Kullanıcı adı zaten mevcut.
 */
router.post('/register', authController.register);

/**
 * @openapi
 * /api/v1/auth/login:
 *   post:
 *     summary: Kullanıcı girişi ve JWT üretimi
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, password]
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Giriş başarılı, token döner.
 *       401:
 *         description: Hatalı kullanıcı adı veya şifre.
 */
router.post('/login', authController.login);

export default router;

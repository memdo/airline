require('dotenv').config();
const express = require('express');
const proxy = require('express-http-proxy');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

const PORT = process.env.PORT || 3000;
const API_URL = process.env.API_URL || 'http://localhost:3001';

// Middleware
// Azure Load Balancer arkasında doğru IP tespiti için proxy'lere güven:
app.set('trust proxy', 1);
app.use(cors());
app.use(morgan('dev')); // console logging Request

// --- Rate Limiters ---

// 1. General Rate Limiter (e.g., 100 requests per 15 minutes)
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  limit: 100, 
  standardHeaders: 'draft-7', 
  legacyHeaders: false, 
  message: {
    status: 'error',
    message: 'Genel istek sınırını aştınız. Lütfen daha sonra tekrar deneyin.'
  }
});

// 2. Flight Query Rate Limiter (Limit calls to 3 per day) as per assignment
const flightQueryLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  limit: 3, 
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    status: 'error',
    message: 'Günlük uçuş sorgulama limitini (3 çağrı) doldurdunuz. Lütfen yarın tekrar deneyin.'
  }
});

// Apply general limiter to all requests first
app.use(generalLimiter);

// Specific limit for Flight Query (GET /api/v1/flights)
// Note: We only want to limit the GET request to /api/v1/flights, not the POST (add flight).
app.get('/api/v1/flights', flightQueryLimiter);

// --- Proxy Configuration ---

// API_URL'in sonundaki olası / işaretini temizleyelim
const targetUrl = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;

// Forward all requests to the Airline API
app.use('/', proxy(targetUrl, {
  proxyReqOptDecorator: function(proxyReqOpts, srcReq) {
    // Azure için kritik: Orijinal host başlığını iletme, bırak Azure kendisi ayarlasın.
    // Bu, "Uzak sunucuya bağlanılamadı" hatasını çözer.
    delete proxyReqOpts.headers['host'];
    return proxyReqOpts;
  },
  // HTTPS üzerinden güvenli iletişim için protokol kontrolü
  https: targetUrl.startsWith('https'),
  timeout: 10000, 
  proxyErrorHandler: function(err, res, next) {
    console.error(`[Gateway Proxy Error]`, err);
    res.status(502).json({
      status: 'error',
      message: 'Uzak sunucuya (API) bağlanılamadı. Lütfen alt sistemin çalıştığından emin olun.',
      detail: err.message // Hatayı daha net görmek için detayı ekledik
    });
  }
}));

app.listen(PORT, () => {
  console.log(`[Airline Gateway] Gateway sunucusu çalışıyor: http://localhost:${PORT}`);
  console.log(`[Airline Gateway] İstekler -> ${API_URL} adresine yönlendirilecek.`);
});

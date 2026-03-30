import http from 'k6/http';
import { check, sleep } from 'k6';

// Senaryoları ortam değişkenine (SCENARIO) göre belirle
const scenario = __ENV.SCENARIO || 'peak';

const scenarios = {
  normal: { vus: 20, duration: '60s' },
  peak: { vus: 50, duration: '60s' },
  stress: { vus: 100, duration: '60s' },
};

export const options = {
  vus: scenarios[scenario].vus,
  duration: scenarios[scenario].duration,
  thresholds: {
    http_req_duration: ['p(95)<500'], // İsteklerin %95'i 500ms'den kısa sürmeli
    http_req_failed: ['rate<0.01'],   // Hata oranı %1'den az olmalı
  },
};

const BASE_URL = 'http://localhost:3001/api/v1';

// Test verileri (Statik veya dinamik olabilir)
const FLIGHT_QUERY = 'dateFrom=2026-03-28&dateTo=2026-03-29&airportFrom=ADB&airportTo=IST&numberOfPeople=1';

export function setup() {
  // 1. Önce uçuşun var olduğundan emin olunmalı (veya manuel eklenmiş olmalı)
  // 2. Bir test kullanıcısı ile login olup token alalım
  // Not: Gerçek senaryoda kullanıcı yoksa register da edilebilir
  const loginRes = http.post(`${BASE_URL}/auth/login`, JSON.stringify({
    username: 'admin', // Varsayılan admin kullanıcısı veya test kullanıcısı
    password: 'password123',
  }), {
    headers: { 'Content-Type': 'application/json' },
  });

  if (loginRes.status !== 200) {
    console.error('Setup failed: Login unsuccessful. Please ensure user "admin" exists with "password123".');
    return { token: null };
  }

  return { token: loginRes.json('token'), flightNumber: '12345' };
}

export default function (data) {
  // Senaryo 1: Uçuş Sorgulama (Query Flight)
  const queryRes = http.get(`${BASE_URL}/flights?${FLIGHT_QUERY}`);
  check(queryRes, {
    'Query Flight status is 200': (r) => r.status === 200,
  });

  sleep(1);

  // Senaryo 2: Bilet Satın Alma (Buy Ticket) - Sadece token varsa
  if (data.token) {
    const buyRes = http.post(`${BASE_URL}/tickets`, JSON.stringify({
      flightNumber: data.flightNumber,
      date: '2026-03-28',
      passengerNames: [`LoadTester-${__VU}-${__ITER}`],
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${data.token}`,
      },
      responseCallback: http.expectedStatuses(201, 409),
    });

    check(buyRes, {
      'Buy Ticket status is 201 or 409 (Sold Out)': (r) => r.status === 201 || r.status === 409,
    });
  }

  sleep(1);
}

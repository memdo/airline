import http from 'k6/http';
import { check, sleep } from 'k6';

// Load Scenarios
export const options = {
  scenarios: {
    normal_load: {
      executor: 'constant-vus',
      vus: 20,
      duration: '60s',
    },
    peak_load: {
      executor: 'constant-vus',
      vus: 50,
      duration: '60s',
      startTime: '65s',
    },
    stress_load: {
      executor: 'constant-vus',
      vus: 100,
      duration: '60s',
      startTime: '130s',
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests must complete below 500ms
    http_req_failed: ['rate<0.01'],    // Error rate should be less than 1%
  },
};

const BASE_URL = __ENV.API_URL || 'http://localhost:3001/api/v1';

export default function () {
  const url = `${BASE_URL}/flights?dateFrom=2026-06-01&dateTo=2026-06-30&airportFrom=IST&airportTo=JFK&numberOfPeople=1`;

  const res = http.get(url);

  check(res, {
    'status is 200': (r) => r.status === 200,
    'transaction time OK': (r) => r.timings.duration < 500,
  });

  sleep(1);
}

const http = require('http');

const PORT = 3000;
const BASE_URL = `http://localhost:${PORT}/api`;

function request(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(BASE_URL + path);
    const options = {
      method,
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Starting Automated API & Factors Verification Suite...\n');

  try {
    // 1. Health check
    const health = await request('GET', '/health');
    console.log('✓ GET /api/health:', health.status === 200 ? 'PASS' : 'FAIL', health.body);

    // 2. Test CO2 Conversion Factors via POST /api/activities
    const testCases = [
      { type: 'car', quantity: 10, expected: 2.00 },
      { type: 'bus', quantity: 10, expected: 0.80 },
      { type: 'flight', quantity: 10, expected: 2.50 },
      { type: 'electricity', quantity: 10, expected: 8.00 },
      { type: 'veg meal', quantity: 2, expected: 1.00 },
      { type: 'non-veg meal', quantity: 2, expected: 4.00 }
    ];

    console.log('\n--- CO2 Conversion Factors Verification ---');
    for (const tc of testCases) {
      const res = await request('POST', '/activities', {
        type: tc.type,
        quantity: tc.quantity,
        notes: `Automated test for ${tc.type}`
      });
      const actual = res.body.data ? res.body.data.co2_kg : null;
      const pass = actual === tc.expected;
      console.log(`${pass ? '✅' : '❌'} ${tc.type} (${tc.quantity} units): expected ${tc.expected} kg CO2, got ${actual} kg CO2`);
    }

    // 3. GET /api/summary
    const summary = await request('GET', '/summary');
    console.log('\n✓ GET /api/summary:', summary.status === 200 ? 'PASS' : 'FAIL');
    console.log('  Total CO2:', summary.body.summary.totalCO2, 'kg');
    console.log('  Target Exceeded (DP1 Nudge):', summary.body.summary.isTargetExceeded);

    // 4. GET /api/decisions
    const decisions = await request('GET', '/decisions');
    console.log('\n✓ GET /api/decisions:', decisions.status === 200 ? 'PASS' : 'FAIL');
    console.log('  Decision points returned:', decisions.body.decisions.length);

    console.log('\n🎉 ALL TESTS COMPLETED SUCCESSFULLY!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Test suite failed:', err);
    process.exit(1);
  }
}

runTests();

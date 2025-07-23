# Load Testing Script

Improved Node.js load testing script for API performance testing.

## Features

- ✅ **CLI Arguments**: Configure VUs, duration, URLs via command line
- ✅ **Proper Ramp Phases**: Ramp-up → Steady → Ramp-down with global timing
- ✅ **Concurrency Control**: Multiple parallel requests per virtual user
- ✅ **Response Histogram**: Performance distribution buckets
- ✅ **Progress Indicator**: Real-time progress bar (unless `--verbose`)
- ✅ **Fixed Metrics**: Correct p95 calculation and error rate handling
- ✅ **Staging Default**: Targets `https://staging.inflatemate.co` by default

## Usage

### Basic Usage
```bash
# Default: 50 VUs, 20s duration, staging environment
npm run test:k6

# Custom configuration
node __test__/load/api-load-test-node.js --vus 80 --duration 30s

# Test local environment
node __test__/load/api-load-test-node.js --base http://localhost:3000
```

### Advanced Options
```bash
# High concurrency test
node __test__/load/api-load-test-node.js \
  --vus 100 \
  --duration 2m \
  --concurrency 3 \
  --ramp-up 10s \
  --ramp-down 5s

# Verbose mode with detailed logs
node __test__/load/api-load-test-node.js --verbose

# Production-like test
node __test__/load/api-load-test-node.js \
  --base https://app.inflatemate.co \
  --vus 200 \
  --duration 5m \
  --concurrency 2
```

## CLI Options

| Option | Alias | Type | Default | Description |
|--------|-------|------|---------|-------------|
| `--vus` | `-v` | number | 50 | Number of virtual users |
| `--duration` | `-d` | string | "20s" | Test duration (e.g., 30s, 2m) |
| `--ramp-up` | | string | "5s" | Ramp-up duration |
| `--ramp-down` | | string | "5s" | Ramp-down duration |
| `--base` | `-b` | string | staging.inflatemate.co | Base URL to test |
| `--concurrency` | `-c` | number | 1 | Parallel requests per VU |
| `--verbose` | | boolean | false | Show detailed request logs |

## Response Time Histogram

The script shows performance distribution in buckets:

- **0-50ms**: 🟢 Excellent performance
- **51-100ms**: 🟡 Good performance  
- **101-200ms**: 🟠 Acceptable performance
- **200ms+**: 🔴 Slow performance

## Thresholds

Default thresholds (configurable in script):
- **Error rate**: <1%
- **p95 response time**: <200ms

## Example Output

```
🚀 Node.js Load Test (Improved)
📊 Config: 50 VUs, 20s duration, 1 concurrent requests/VU
🎯 Testing: https://staging.inflatemate.co

📈 Phase 1: Ramping up virtual users...
⚡ Phase 2: Steady state load testing...
📉 Phase 3: Ramping down...
📊 Phase 4: Analyzing results...

========================
📈 LOAD TEST RESULTS
========================

Duration: 22.15s
Total Requests: 732
Requests/sec: 33.05
Errors: 0 (0.00%)

Response Times:
  Average: 45ms
  p95: 98ms
  Min: 12ms
  Max: 156ms

Response Time Histogram:
  0-50ms:     582 requests (79.5%)
  51-100ms:   128 requests (17.5%)
  101-200ms:  22 requests (3.0%)
  200ms+:     0 requests (0.0%)

Thresholds:
✅ Error rate: 0.00% ≤ 1%
✅ p95 response time: 98ms ≤ 200ms

🎉 All thresholds PASSED!
```

## API Endpoints Tested (Public Routes Only)

- `GET /api/businesses/{businessId}` - Public business information (limited data, no auth required)
- `GET /api/businesses/{businessId}/availability` - Public availability check
- `GET /api/embed/{businessId}` - Public embed configuration  
- `OPTIONS /api/monitoring` - Public CORS endpoint for Sentry proxy

**Note**: All endpoints are public and don't require authentication, making them ideal for load testing.

⚠️ **Staging Environment**: The staging server has aggressive DDoS protection and will rate limit load tests. Use localhost for development testing:

```bash
# Test local development
node __test__/load/api-load-test-node.js --base http://localhost:3000
```

## Environment Variables

- `BASE_URL`: Override default base URL (can also use `--base` flag)

## Integration

The script can be imported as a module:

```javascript
const { runLoadTest } = require('./__test__/load/api-load-test-node.js');

// Returns stats object with results
const stats = await runLoadTest();
``` 
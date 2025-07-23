#!/usr/bin/env node

/**
 * Node.js Load Testing Script (Improved)
 * 
 * Usage:
 *   node __test__/load/api-load-test-node.js [options]
 *   
 * Examples:
 *   node __test__/load/api-load-test-node.js --vus 80 --duration 30s --base https://staging.inflatemate.co
 *   node __test__/load/api-load-test-node.js --verbose --ramp-up 10s --ramp-down 5s
 *   
 * Response Time Histogram:
 *   Shows distribution of response times in buckets:
 *   - 0-50ms: Excellent performance 
 *   - 51-100ms: Good performance
 *   - 101-200ms: Acceptable performance  
 *   - 200ms+: Slow performance
 *   
 * Thresholds:
 *   - Error rate: <1% (configurable)
 *   - p95 response time: <200ms (configurable)
 */

const https = require('https');
const http = require('http');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const ora = require('ora');

// Parse CLI arguments
const argv = yargs(hideBin(process.argv))
  .option('vus', {
    alias: 'v',
    type: 'number',
    description: 'Number of virtual users',
    default: 50
  })
  .option('duration', {
    alias: 'd', 
    type: 'string',
    description: 'Test duration (e.g., 30s, 2m)',
    default: '20s'
  })
  .option('ramp-up', {
    type: 'string',
    description: 'Ramp-up duration (e.g., 5s)',
    default: '5s'
  })
  .option('ramp-down', {
    type: 'string', 
    description: 'Ramp-down duration (e.g., 5s)',
    default: '5s'
  })
  .option('base', {
    alias: 'b',
    type: 'string',
    description: 'Base URL to test',
    default: process.env.BASE_URL || 'https://staging.inflatemate.co'
  })
  .option('concurrency', {
    alias: 'c',
    type: 'number',
    description: 'Parallel requests per virtual user',
    default: 1
  })
  .option('verbose', {
    type: 'boolean',
    description: 'Show detailed request logs',
    default: false
  })
  .help()
  .argv;

// Parse duration strings (e.g., "30s", "2m") to milliseconds
function parseDuration(str) {
  const match = str.match(/^(\d+)([sm])$/);
  if (!match) throw new Error(`Invalid duration format: ${str}`);
  const [, value, unit] = match;
  return parseInt(value) * (unit === 's' ? 1000 : 60000);
}

// Configuration
const config = {
  baseUrl: argv.base,
  virtualUsers: argv.vus,
  testDuration: parseDuration(argv.duration),
  rampUpDuration: parseDuration(argv.rampUp),
  rampDownDuration: parseDuration(argv.rampDown),
  concurrencyPerVU: argv.concurrency,
  verbose: argv.verbose,
  
  // Thresholds
  thresholds: {
    errorRate: 1, // <1% errors (already percentage)
    p95ResponseTime: 200, // p95 <200ms
  }
};

// Helper function to get a date N days from now in YYYY-MM-DD format
function getDateInDays(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
}

// Test endpoints - Mix of API and page routes to test different protection levels
const businessId = 'cmb5lnorg000bcvbcwbpxii0p';
const endpoints = [
  // Public business info (returns limited data when not authenticated)
  { path: `/api/businesses/${businessId}`, name: 'business-public', method: 'GET' },
  
  // Public availability check (no auth required) - using a date 30 days from now
  { path: `/api/businesses/${businessId}/availability?date=${getDateInDays(30)}&startTime=10:00&endTime=14:00&tz=America/Chicago`, name: 'availability', method: 'GET' },
  
  // Public pages (might have less aggressive rate limiting)
  { path: '/pricing', name: 'pricing-page', method: 'GET' },
  { path: '/', name: 'homepage', method: 'GET' },
];

// Results tracking
const results = {
  requests: 0,
  errors: 0,
  responseTimes: [],
  startTime: Date.now(),
  endTime: null,
  histogram: {
    '0-50ms': 0,
    '51-100ms': 0, 
    '101-200ms': 0,
    '200ms+': 0
  }
};

let spinner;

// Initialize progress spinner
if (!config.verbose) {
  spinner = ora('Initializing load test...').start();
}

// Make HTTP request
function makeRequest(endpoint) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const url = new URL(config.baseUrl + endpoint.path);
    const client = url.protocol === 'https:' ? https : http;
    
    const req = client.request({
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: endpoint.method || 'GET',
      timeout: 5000,
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const responseTime = Date.now() - startTime;
        results.requests++;
        results.responseTimes.push(responseTime);
        
        // Update histogram
        if (responseTime <= 50) {
          results.histogram['0-50ms']++;
        } else if (responseTime <= 100) {
          results.histogram['51-100ms']++;
        } else if (responseTime <= 200) {
          results.histogram['101-200ms']++;
        } else {
          results.histogram['200ms+']++;
        }
        
        if (res.statusCode >= 400) {
          results.errors++;
          if (config.verbose) {
            console.log(`❌ ${endpoint.name}: ${res.statusCode} (${responseTime}ms)`);
          }
        } else {
          if (config.verbose) {
            console.log(`✅ ${endpoint.name}: ${res.statusCode} (${responseTime}ms)`);
          }
        }
        
        resolve({ statusCode: res.statusCode, responseTime, endpoint: endpoint.name });
      });
    });
    
    req.on('error', (err) => {
      const responseTime = Date.now() - startTime;
      results.requests++;
      results.errors++;
      results.responseTimes.push(responseTime);
      results.histogram['200ms+']++;
      
      if (config.verbose) {
        console.log(`❌ ${endpoint.name}: ERROR ${err.code || err.message} - ${err.message} (${responseTime}ms)`);
      }
      resolve({ statusCode: 0, responseTime, endpoint: endpoint.name, error: err.message });
    });
    
    req.on('timeout', () => {
      req.destroy();
      const responseTime = Date.now() - startTime;
      results.requests++;
      results.errors++;
      results.responseTimes.push(responseTime);
      results.histogram['200ms+']++;
      
      if (config.verbose) {
        console.log(`❌ ${endpoint.name}: TIMEOUT (${responseTime}ms)`);
      }
      resolve({ statusCode: 0, responseTime, endpoint: endpoint.name, error: 'timeout' });
    });
    
    req.end();
  });
}

// Virtual user simulation with concurrency
async function virtualUser(userId, stopAt) {
  const requests = [];
  
  while (Date.now() < stopAt) {
    // Create concurrent requests based on concurrencyPerVU
    for (let i = 0; i < config.concurrencyPerVU; i++) {
      if (Date.now() >= stopAt) break;
      
      // Pick random endpoint
      const endpoint = endpoints[Math.floor(Math.random() * endpoints.length)];
      requests.push(makeRequest(endpoint));
      
      // If we have enough concurrent requests, wait for them
      if (requests.length >= config.concurrencyPerVU) {
        await Promise.all(requests.splice(0, config.concurrencyPerVU));
        
                 // Random delay between batches
         if (Date.now() < stopAt) {
           await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 400));
         }
      }
    }
  }
  
  // Wait for any remaining requests
  if (requests.length > 0) {
    await Promise.all(requests);
  }
}

// Calculate statistics
function calculateStats() {
  if (results.responseTimes.length === 0) {
    return {
      total: 0,
      errors: 0,
      errorRate: 0,
      avgResponseTime: 0,
      p95ResponseTime: 0,
      minResponseTime: 0,
      maxResponseTime: 0,
    };
  }
  
  const sorted = results.responseTimes.sort((a, b) => a - b);
  const p95Index = Math.ceil(sorted.length * 0.95) - 1; // Fixed p95 calculation
  const avg = sorted.reduce((a, b) => a + b, 0) / sorted.length;
  
  return {
    total: results.requests,
    errors: results.errors,
    errorRate: (results.errors / results.requests) * 100,
    avgResponseTime: Math.round(avg),
    p95ResponseTime: sorted[p95Index] || 0,
    minResponseTime: sorted[0] || 0,
    maxResponseTime: sorted[sorted.length - 1] || 0,
  };
}

// Update progress spinner
function updateProgress(phase, activeVUs, totalRequests) {
  if (!config.verbose && spinner) {
    spinner.text = `${phase} | VUs: ${activeVUs} | Requests: ${totalRequests} | Errors: ${results.errors}`;
  }
}

// Main load test execution
async function runLoadTest() {
  console.log('🚀 Node.js Load Test (Improved)');
  console.log(`📊 Config: ${config.virtualUsers} VUs, ${config.testDuration/1000}s duration, ${config.concurrencyPerVU} concurrent requests/VU`);
  console.log(`🎯 Testing: ${config.baseUrl}`);
  console.log('');
  
  // Calculate timing
  const testStartTime = Date.now();
  const rampUpEndTime = testStartTime + config.rampUpDuration;
  const steadyEndTime = rampUpEndTime + (config.testDuration - config.rampUpDuration - config.rampDownDuration);
  const testEndTime = steadyEndTime + config.rampDownDuration;
  
  const userPromises = [];
  let activeVUs = 0;
  
  // Progress update interval
  const progressInterval = setInterval(() => {
    updateProgress('Testing', activeVUs, results.requests);
  }, 1000);
  
  // Phase 1: Ramp-up
  if (!config.verbose) spinner.text = 'Phase 1: Ramping up virtual users...';
  console.log('📈 Phase 1: Ramping up virtual users...');
  
  for (let i = 0; i < config.virtualUsers; i++) {
    const delay = (i / config.virtualUsers) * config.rampUpDuration;
    const userPromise = new Promise((resolve) => {
      setTimeout(async () => {
        activeVUs++;
        try {
          await virtualUser(i, testEndTime); // Use global stop time
          resolve();
        } catch (error) {
          if (config.verbose) {
            console.error(`Virtual User ${i} error:`, error);
          }
          resolve();
        } finally {
          activeVUs--;
        }
      }, delay);
    });
    userPromises.push(userPromise);
  }
  
  // Phase 2: Steady state
  setTimeout(() => {
    if (!config.verbose) spinner.text = 'Phase 2: Steady state load testing...';
    console.log('⚡ Phase 2: Steady state load testing...');
  }, config.rampUpDuration);
  
  // Phase 3: Ramp-down (VUs naturally stop as they reach testEndTime)
  setTimeout(() => {
    if (!config.verbose) spinner.text = 'Phase 3: Ramping down...';
    console.log('📉 Phase 3: Ramping down...');
  }, config.testDuration - config.rampDownDuration);
  
  // Wait for all virtual users to complete
  await Promise.all(userPromises);
  clearInterval(progressInterval);
  results.endTime = Date.now();
  
  if (!config.verbose && spinner) {
    spinner.succeed('Load test completed');
  }
  
  // Phase 4: Results
  console.log('📊 Phase 4: Analyzing results...');
  console.log('');
  
  const stats = calculateStats();
  const duration = (results.endTime - results.startTime) / 1000;
  
  console.log('========================');
  console.log('📈 LOAD TEST RESULTS');
  console.log('========================');
  console.log('');
  console.log(`Duration: ${duration.toFixed(2)}s`);
  console.log(`Total Requests: ${stats.total || 0}`);
  console.log(`Requests/sec: ${stats.total > 0 ? (stats.total / duration).toFixed(2) : '0.00'}`);
  console.log(`Errors: ${stats.errors || 0} (${(stats.errorRate || 0).toFixed(2)}%)`);
  console.log('');
  console.log('Response Times:');
  console.log(`  Average: ${stats.avgResponseTime || 0}ms`);
  console.log(`  p95: ${stats.p95ResponseTime || 0}ms`);
  console.log(`  Min: ${stats.minResponseTime || 0}ms`);
  console.log(`  Max: ${stats.maxResponseTime || 0}ms`);
  console.log('');
  console.log('Response Time Histogram:');
  console.log(`  0-50ms:     ${results.histogram['0-50ms']} requests (${((results.histogram['0-50ms']/stats.total)*100).toFixed(1)}%)`);
  console.log(`  51-100ms:   ${results.histogram['51-100ms']} requests (${((results.histogram['51-100ms']/stats.total)*100).toFixed(1)}%)`);
  console.log(`  101-200ms:  ${results.histogram['101-200ms']} requests (${((results.histogram['101-200ms']/stats.total)*100).toFixed(1)}%)`);
  console.log(`  200ms+:     ${results.histogram['200ms+']} requests (${((results.histogram['200ms+']/stats.total)*100).toFixed(1)}%)`);
  console.log('');
  console.log('Thresholds:');
  
  // Check thresholds (fixed error rate math)
  let passed = true;
  const errorRate = stats.errorRate || 0;
  
  if (errorRate > config.thresholds.errorRate) { // Removed /100
    console.log(`❌ Error rate: ${errorRate.toFixed(2)}% > ${config.thresholds.errorRate}%`);
    passed = false;
  } else {
    console.log(`✅ Error rate: ${errorRate.toFixed(2)}% ≤ ${config.thresholds.errorRate}%`);
  }
  
  const p95ResponseTime = stats.p95ResponseTime || 0;
  if (p95ResponseTime > config.thresholds.p95ResponseTime) {
    console.log(`❌ p95 response time: ${p95ResponseTime}ms > ${config.thresholds.p95ResponseTime}ms`);
    passed = false;
  } else {
    console.log(`✅ p95 response time: ${p95ResponseTime}ms ≤ ${config.thresholds.p95ResponseTime}ms`);
  }
  
  console.log('');
  console.log(passed ? '🎉 All thresholds PASSED!' : '⚠️ Some thresholds FAILED!');
  
  // Return stats for programmatic use
  const finalStats = {
    passed,
    duration,
    requestsPerSecond: stats.total > 0 ? stats.total / duration : 0,
    ...stats,
    histogram: results.histogram
  };
  
  // Exit with appropriate code
  if (passed) {
    process.exit(0);
  } else {
    process.exit(1);
  }
  
  return finalStats;
}

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n⏹️ Load test interrupted');
  if (spinner) spinner.fail('Load test interrupted');
  process.exit(1);
});

// Run the load test
if (require.main === module) {
  runLoadTest().catch(error => {
    console.error('💥 Load test failed:', error);
    if (spinner) spinner.fail('Load test failed');
    process.exit(1);
  });
}

module.exports = { runLoadTest, calculateStats }; 
/**
 * Standalone coverage analysis script.
 *
 * Reads reports/json-report/results.json (produced by Playwright's JSON reporter)
 * and prints a detailed endpoint-coverage table to stdout.
 *
 * Usage:
 *   npm run report:coverage
 *   # or directly:
 *   npx ts-node scripts/coverage-report.ts
 */

import * as fs from 'fs';
import * as path from 'path';

const RESULTS_PATH = path.resolve('reports/json-report/results.json');
const COVERAGE_PATH = path.resolve('reports/coverage-report/coverage.json');

interface EndpointStat {
  method: string;
  endpoint: string;
  testedCount: number;
  passed: number;
  failed: number;
}

const ALL_ENDPOINTS: Array<{ method: string; endpoint: string }> = [
  { method: 'POST', endpoint: '/auth/login' },
  { method: 'POST', endpoint: '/auth/register' },
  { method: 'GET', endpoint: '/products' },
  { method: 'GET', endpoint: '/products/{id}' },
  { method: 'POST', endpoint: '/cart/items' },
  { method: 'GET', endpoint: '/cart' },
  { method: 'DELETE', endpoint: '/cart/items/{itemId}' },
  { method: 'POST', endpoint: '/orders' },
  { method: 'GET', endpoint: '/orders/{orderId}' },
  { method: 'DELETE', endpoint: '/orders/{orderId}/cancel' },
  { method: 'POST', endpoint: '/payments' },
  { method: 'GET', endpoint: '/payments/{paymentId}' },
];

function loadResults(): Record<string, unknown> {
  if (!fs.existsSync(RESULTS_PATH)) {
    console.error(
      `\n❌  Results file not found: ${RESULTS_PATH}\n   Run "npm test" first.\n`,
    );
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(RESULTS_PATH, 'utf-8')) as Record<string, unknown>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function flattenTests(suite: any): any[] {
  const tests: unknown[] = [];
  if (suite.tests) tests.push(...suite.tests);
  if (suite.suites) {
    for (const child of suite.suites) tests.push(...flattenTests(child));
  }
  return tests;
}

function analyze(): void {
  const results = loadResults();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const allTests = flattenTests({ suites: (results as any).suites ?? [] });

  const stats = new Map<string, EndpointStat>();
  for (const ep of ALL_ENDPOINTS) {
    stats.set(`${ep.method} ${ep.endpoint}`, {
      ...ep,
      testedCount: 0,
      passed: 0,
      failed: 0,
    });
  }

  let totalPassed = 0;
  let totalFailed = 0;

  for (const test of allTests) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const t = test as any;
    const annotation = (t.annotations ?? []).find(
      (a: { type: string }) => a.type === 'endpoint',
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result: any = (t.results ?? [])[0];
    if (!result) continue;

    const status: string = result.status;
    if (status === 'passed') totalPassed++;
    else if (status === 'failed' || status === 'timedOut') totalFailed++;

    if (!annotation?.description) continue;
    const stat = stats.get(annotation.description);
    if (!stat) continue;

    stat.testedCount++;
    if (status === 'passed') stat.passed++;
    else if (status === 'failed' || status === 'timedOut') stat.failed++;
  }

  const epArray = Array.from(stats.values());
  const covered = epArray.filter((e) => e.testedCount > 0).length;
  const pct = ((covered / epArray.length) * 100).toFixed(1);

  // ── Console table ───────────────────────────────────────────────────────
  console.log('\n╔═══════════════════════════════════════════════════════════╗');
  console.log('║       ShopEasy API – Endpoint Coverage Summary            ║');
  console.log('╚═══════════════════════════════════════════════════════════╝\n');

  const col = (s: string, w: number) => s.padEnd(w).slice(0, w);

  console.log(
    `  ${col('Method', 8)}${col('Endpoint', 36)}${col('Tests', 7)}${col('Pass', 6)}${col('Fail', 6)}`,
  );
  console.log('  ' + '─'.repeat(63));

  for (const e of epArray) {
    const testedMark = e.testedCount > 0 ? '✓' : '✗';
    console.log(
      `  ${testedMark} ${col(e.method, 7)}${col(e.endpoint, 36)}${col(
        String(e.testedCount),
        7,
      )}${col(String(e.passed), 6)}${col(String(e.failed), 6)}`,
    );
  }

  console.log('  ' + '─'.repeat(63));
  console.log(`\n  Coverage : ${pct}%  (${covered}/${epArray.length} endpoints)`);
  console.log(`  Passed   : ${totalPassed}`);
  console.log(`  Failed   : ${totalFailed}`);
  console.log();

  // ── Persist a quick JSON summary alongside the reporter output ──────────
  if (fs.existsSync(COVERAGE_PATH)) {
    const existing = JSON.parse(fs.readFileSync(COVERAGE_PATH, 'utf-8'));
    console.log(`  📄  Full coverage report: ${COVERAGE_PATH}`);
    console.log(`  🌐  HTML report          : ${path.resolve('reports/coverage-report/coverage.html')}`);
    // Update the summary block with the freshly computed values
    existing.scriptSummary = { coveragePercentage: `${pct}%`, totalPassed, totalFailed };
    fs.writeFileSync(COVERAGE_PATH, JSON.stringify(existing, null, 2));
  }

  console.log();
}

analyze();

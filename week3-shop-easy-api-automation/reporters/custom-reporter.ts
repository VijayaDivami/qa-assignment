import type {
  Reporter,
  TestCase,
  TestResult,
  FullResult,
} from '@playwright/test/reporter';
import * as fs from 'fs';
import * as path from 'path';

interface EndpointRecord {
  method: string;
  endpoint: string;
  key: string;
  tested: boolean;
  testCount: number;
  passed: number;
  failed: number;
  skipped: number;
  testNames: string[];
}

/** All 12 endpoints defined in the ShopEasy openapi.yaml */
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

class CoverageReporter implements Reporter {
  private readonly records = new Map<string, EndpointRecord>();
  private startTime = Date.now();
  private totalTests = 0;
  private passedTests = 0;
  private failedTests = 0;
  private skippedTests = 0;

  constructor() {
    for (const ep of ALL_ENDPOINTS) {
      const key = `${ep.method} ${ep.endpoint}`;
      this.records.set(key, {
        ...ep,
        key,
        tested: false,
        testCount: 0,
        passed: 0,
        failed: 0,
        skipped: 0,
        testNames: [],
      });
    }
  }

  onTestEnd(test: TestCase, result: TestResult): void {
    this.totalTests++;

    if (result.status === 'passed') this.passedTests++;
    else if (result.status === 'failed' || result.status === 'timedOut') this.failedTests++;
    else if (result.status === 'skipped') this.skippedTests++;

    const annotation = test.annotations.find((a) => a.type === 'endpoint');
    if (!annotation?.description) return;

    const rec = this.records.get(annotation.description);
    if (!rec) return;

    rec.tested = true;
    rec.testCount++;
    rec.testNames.push(test.title);

    if (result.status === 'passed') rec.passed++;
    else if (result.status === 'failed' || result.status === 'timedOut') rec.failed++;
    else rec.skipped++;
  }

  async onEnd(result: FullResult): Promise<void> {
    const reportDir = path.resolve('reports/coverage-report');
    fs.mkdirSync(reportDir, { recursive: true });

    const endpoints = Array.from(this.records.values());
    const testedCount = endpoints.filter((e) => e.tested).length;
    const coveragePct = ((testedCount / endpoints.length) * 100).toFixed(1);
    const durationMs = Date.now() - this.startTime;

    const report = {
      summary: {
        generatedAt: new Date().toISOString(),
        durationMs,
        totalEndpoints: endpoints.length,
        testedEndpoints: testedCount,
        untestedEndpoints: endpoints.length - testedCount,
        coveragePercentage: `${coveragePct}%`,
        totalTests: this.totalTests,
        passedTests: this.passedTests,
        failedTests: this.failedTests,
        skippedTests: this.skippedTests,
        overallStatus: result.status,
      },
      endpoints,
    };

    // ── JSON report ──────────────────────────────────────────────────────
    fs.writeFileSync(
      path.join(reportDir, 'coverage.json'),
      JSON.stringify(report, null, 2),
    );

    // ── HTML report ──────────────────────────────────────────────────────
    fs.writeFileSync(path.join(reportDir, 'coverage.html'), this.renderHtml(report));

    // ── Console summary ──────────────────────────────────────────────────
    const statusIcon = result.status === 'passed' ? '✅' : '❌';
    console.log('\n─────────────────────────────────────────');
    console.log('  API Endpoint Coverage Report');
    console.log('─────────────────────────────────────────');
    console.log(`  Status      : ${statusIcon} ${result.status.toUpperCase()}`);
    console.log(`  Coverage    : ${coveragePct}%  (${testedCount}/${endpoints.length} endpoints)`);
    console.log(`  Tests Run   : ${this.totalTests}`);
    console.log(`  Passed      : ${this.passedTests}`);
    console.log(`  Failed      : ${this.failedTests}`);
    console.log(`  Skipped     : ${this.skippedTests}`);
    console.log(`  Duration    : ${(durationMs / 1000).toFixed(1)}s`);
    console.log('─────────────────────────────────────────');

    const untested = endpoints.filter((e) => !e.tested);
    if (untested.length > 0) {
      console.log('  ⚠️  Untested endpoints:');
      for (const e of untested) {
        console.log(`     • ${e.method.padEnd(7)} ${e.endpoint}`);
      }
    }
    console.log('─────────────────────────────────────────\n');
  }

  private renderHtml(report: ReturnType<CoverageReporter['buildReport']>): string {
    const { summary, endpoints } = report;
    const statusColor = summary.overallStatus === 'passed' ? '#22c55e' : '#ef4444';
    const coverageNum = parseFloat(summary.coveragePercentage);
    const barColor = coverageNum === 100 ? '#22c55e' : coverageNum >= 75 ? '#f59e0b' : '#ef4444';

    const rows = endpoints
      .map((e) => {
        const statusBadge = e.tested
          ? `<span class="badge pass">TESTED</span>`
          : `<span class="badge fail">UNTESTED</span>`;
        const passRate =
          e.testCount > 0 ? `${((e.passed / e.testCount) * 100).toFixed(0)}%` : '—';
        return `
      <tr>
        <td><span class="method method-${e.method.toLowerCase()}">${e.method}</span></td>
        <td class="endpoint-path">${e.endpoint}</td>
        <td>${statusBadge}</td>
        <td>${e.testCount}</td>
        <td class="pass-cell">${e.passed}</td>
        <td class="fail-cell">${e.failed}</td>
        <td>${passRate}</td>
      </tr>`;
      })
      .join('\n');

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>ShopEasy API Coverage Report</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
           background: #0f172a; color: #e2e8f0; padding: 2rem; }
    h1 { font-size: 1.6rem; margin-bottom: 0.25rem; }
    .subtitle { color: #94a3b8; font-size: 0.9rem; margin-bottom: 2rem; }
    .cards { display: flex; flex-wrap: wrap; gap: 1rem; margin-bottom: 2rem; }
    .card { background: #1e293b; border-radius: 0.75rem; padding: 1.25rem 1.5rem;
            flex: 1 1 160px; min-width: 140px; }
    .card .label { font-size: 0.75rem; color: #94a3b8; text-transform: uppercase;
                   letter-spacing: 0.05em; }
    .card .value { font-size: 2rem; font-weight: 700; margin-top: 0.25rem; }
    .coverage-bar-wrap { background: #1e293b; border-radius: 0.75rem; padding: 1.25rem;
                          margin-bottom: 2rem; }
    .coverage-bar-wrap .bar-label { display:flex; justify-content:space-between;
                                     margin-bottom: 0.5rem; font-size:0.9rem; }
    .bar-track { background: #334155; border-radius: 9999px; height: 12px; overflow: hidden; }
    .bar-fill { height: 100%; border-radius: 9999px;
                background: ${barColor}; width: ${summary.coveragePercentage}; }
    table { width: 100%; border-collapse: collapse; background: #1e293b;
            border-radius: 0.75rem; overflow: hidden; }
    thead th { background: #334155; padding: 0.75rem 1rem; text-align: left;
               font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em;
               color: #94a3b8; }
    tbody td { padding: 0.75rem 1rem; border-bottom: 1px solid #334155;
               font-size: 0.875rem; }
    tbody tr:last-child td { border-bottom: none; }
    tbody tr:hover { background: #243044; }
    .method { display: inline-block; padding: 0.15rem 0.5rem; border-radius: 0.25rem;
              font-weight: 700; font-size: 0.75rem; }
    .method-get    { background: #0d9488; color: #fff; }
    .method-post   { background: #2563eb; color: #fff; }
    .method-delete { background: #dc2626; color: #fff; }
    .badge { display: inline-block; padding: 0.15rem 0.5rem; border-radius: 9999px;
             font-size: 0.7rem; font-weight: 600; }
    .badge.pass { background: #16a34a22; color: #4ade80; border: 1px solid #16a34a55; }
    .badge.fail { background: #dc262622; color: #f87171; border: 1px solid #dc262655; }
    .endpoint-path { font-family: monospace; color: #93c5fd; }
    .pass-cell { color: #4ade80; }
    .fail-cell { color: #f87171; }
    .status-badge { display: inline-block; padding: 0.2rem 0.75rem; border-radius: 9999px;
                    font-weight: 700; font-size: 0.85rem; background: ${statusColor}22;
                    color: ${statusColor}; border: 1px solid ${statusColor}55; }
    footer { margin-top: 2rem; color: #64748b; font-size: 0.8rem; text-align: center; }
  </style>
</head>
<body>
  <h1>ShopEasy API – Coverage Report</h1>
  <p class="subtitle">
    Generated ${summary.generatedAt} &nbsp;|&nbsp;
    Duration: ${(summary.durationMs / 1000).toFixed(1)}s &nbsp;|&nbsp;
    Status: <span class="status-badge">${summary.overallStatus.toUpperCase()}</span>
  </p>

  <div class="cards">
    <div class="card">
      <div class="label">Coverage</div>
      <div class="value" style="color:${barColor}">${summary.coveragePercentage}</div>
    </div>
    <div class="card">
      <div class="label">Endpoints</div>
      <div class="value">${summary.testedEndpoints}/${summary.totalEndpoints}</div>
    </div>
    <div class="card">
      <div class="label">Total Tests</div>
      <div class="value">${summary.totalTests}</div>
    </div>
    <div class="card">
      <div class="label">Passed</div>
      <div class="value" style="color:#4ade80">${summary.passedTests}</div>
    </div>
    <div class="card">
      <div class="label">Failed</div>
      <div class="value" style="color:#f87171">${summary.failedTests}</div>
    </div>
    <div class="card">
      <div class="label">Skipped</div>
      <div class="value" style="color:#94a3b8">${summary.skippedTests}</div>
    </div>
  </div>

  <div class="coverage-bar-wrap">
    <div class="bar-label">
      <span>Endpoint Coverage</span>
      <span>${summary.coveragePercentage}</span>
    </div>
    <div class="bar-track"><div class="bar-fill"></div></div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Method</th>
        <th>Endpoint</th>
        <th>Status</th>
        <th>Tests</th>
        <th>Passed</th>
        <th>Failed</th>
        <th>Pass Rate</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>

  <footer>ShopEasy API Automation · Playwright · ${new Date().getFullYear()}</footer>
</body>
</html>`;
  }

  /** Typed helper so renderHtml gets the correct shape */
  private buildReport(summary: unknown, endpoints: unknown) {
    return { summary, endpoints } as {
      summary: {
        generatedAt: string;
        durationMs: number;
        totalEndpoints: number;
        testedEndpoints: number;
        untestedEndpoints: number;
        coveragePercentage: string;
        totalTests: number;
        passedTests: number;
        failedTests: number;
        skippedTests: number;
        overallStatus: string;
      };
      endpoints: EndpointRecord[];
    };
  }
}

export default CoverageReporter;

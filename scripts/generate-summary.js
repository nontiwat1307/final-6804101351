// สร้าง reports/test-summary.md จากผลรันจริงใน reports/results.json (ไม่แก้ผลด้วยมือ)
const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, '..', 'reports', 'results.json');
const outPath = path.join(__dirname, '..', 'reports', 'test-summary.md');

if (!fs.existsSync(jsonPath)) {
  console.error('ไม่พบ reports/results.json — รัน `npx playwright test` ก่อน');
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
const rows = [];

function walk(suite, file) {
  const f = suite.file || file;
  for (const spec of suite.specs || []) {
    for (const t of spec.tests || []) {
      const r = (t.results || [])[t.results.length - 1] || {};
      const status = t.status === 'expected' ? 'Passed' : (t.status === 'skipped' ? 'Skipped' : 'Failed');
      let err = '';
      if (r.error && r.error.message) {
        err = r.error.message.replace(/\u001b\[[0-9;]*m/g, '').split('\n')[0].replace(/\|/g, '/');
      }
      rows.push({ file: f, title: spec.title, status, duration: r.duration || 0, err });
    }
  }
  for (const s of suite.suites || []) walk(s, f);
}
for (const s of data.suites || []) walk(s, s.file);

const passed = rows.filter(r => r.status === 'Passed').length;
const failed = rows.filter(r => r.status === 'Failed').length;

let md = `# Test Summary\n\n`;
md += `สร้างอัตโนมัติจาก \`reports/results.json\` (ผลรันจริง)\n\n`;
md += `- รวม: **${rows.length}** tests\n- Passed: **${passed}**\n- Failed: **${failed}**\n\n`;
md += `| Test | File | Status | Duration (ms) | Error (บรรทัดแรก) |\n|---|---|---|---|---|\n`;
for (const r of rows) {
  md += `| ${r.title} | ${r.file} | ${r.status} | ${r.duration} | ${r.err} |\n`;
}
md += `\n## ข้อผิดพลาดที่พบ / หมายเหตุ\n\n`;
md += failed === 0 ? `- ไม่พบ Test ที่ Failed\n` : `- ดูรายละเอียดใน playwright-report/index.html (รัน \`npx playwright show-report\`)\n`;

fs.writeFileSync(outPath, md);
console.log('เขียน reports/test-summary.md แล้ว');

#!/usr/bin/env node
// Renders docs/parity-oracle-v2/results.json into a human-readable HTML report.
import fs from 'fs'
import path from 'path'

const OUT_DIR = process.argv[2] || 'docs/parity-oracle-v2'
const data = JSON.parse(fs.readFileSync(path.join(OUT_DIR, 'results.json'), 'utf8'))

function esc(s) {
  return String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]))
}
function badge(status) {
  const color = status === 'PASS' || status === 'PARITY_PASS' ? '#0a7' : status === 'PARTIAL' || status === 'PARITY_PARTIAL' ? '#c90' : status === 'NOT_EVALUATED' ? '#999' : '#c33'
  return `<span style="display:inline-block;padding:2px 8px;border-radius:4px;background:${color};color:#fff;font-size:12px;font-weight:600">${esc(status)}</span>`
}

const rows = data.results
  .map((r) => {
    const dims = ['urlDimension', 'text', 'media', 'links', 'structure', 'function', 'visual']
    const cells = dims
      .map((d) => {
        const dim = r[d] || {}
        return `<td>${badge(dim.status)}</td>`
      })
      .join('')
    return `<tr>
      <td><a href="${esc(r.refUrl)}" target="_blank">${esc(r.path)}</a><br><small>${esc(r.family)}</small></td>
      <td>${badge(r.overall)}</td>
      ${cells}
    </tr>`
  })
  .join('\n')

const html = `<!doctype html>
<html><head><meta charset="utf-8"><title>Clone Parity Oracle v2 report</title>
<style>
body{font-family:system-ui,sans-serif;margin:2rem;background:#fafafa;color:#222}
table{border-collapse:collapse;width:100%;background:#fff}
th,td{border:1px solid #ddd;padding:8px 10px;text-align:left;font-size:13px;vertical-align:top}
th{background:#333;color:#fff;position:sticky;top:0}
h1{font-size:20px}
.summary{margin-bottom:1rem}
</style></head>
<body>
<h1>Clone Parity Oracle v2 report</h1>
<p class="summary">Generated: ${esc(data.generatedAt)} | Reference: ${esc(data.refBase)} | Clone: ${esc(data.cloneBase)}</p>
<table>
<thead><tr><th>Route</th><th>Overall</th><th>URL</th><th>TEXT</th><th>MEDIA</th><th>LINKS</th><th>STRUCTURE</th><th>FUNCTION</th><th>VISUAL</th></tr></thead>
<tbody>
${rows}
</tbody>
</table>
</body></html>`

fs.writeFileSync(path.join(OUT_DIR, 'report.html'), html)
console.log('Wrote', path.join(OUT_DIR, 'report.html'))

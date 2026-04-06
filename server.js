import { createServer } from 'http'
import { readFileSync, existsSync } from 'fs'
import { join, extname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const PORT = process.env.PORT || 3001
const API_KEY = process.env.ANTHROPIC_API_KEY

const MIME = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
}

function serveStatic(res, filePath) {
  if (!existsSync(filePath)) {
    // SPA fallback
    filePath = join(__dirname, 'dist', 'index.html')
    if (!existsSync(filePath)) {
      res.writeHead(404)
      res.end('Not Found')
      return
    }
  }
  const ext = extname(filePath)
  const mime = MIME[ext] || 'application/octet-stream'
  res.writeHead(200, { 'Content-Type': mime })
  res.end(readFileSync(filePath))
}

async function handleAPIRequest(req, res) {
  if (!API_KEY) {
    res.writeHead(500, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'ANTHROPIC_API_KEY not set' }))
    return
  }

  let body = ''
  for await (const chunk of req) body += chunk

  try {
    const apiRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body,
    })

    const data = await apiRes.text()
    res.writeHead(apiRes.status, {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    })
    res.end(data)
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: err.message }))
  }
}

const server = createServer((req, res) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    })
    res.end()
    return
  }

  // API proxy
  if (req.url === '/api/generate' && req.method === 'POST') {
    handleAPIRequest(req, res)
    return
  }

  // Static files
  let filePath = join(__dirname, 'dist', req.url === '/' ? 'index.html' : req.url)
  serveStatic(res, filePath)
})

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
  if (!API_KEY) {
    console.warn('Warning: ANTHROPIC_API_KEY not set. AI mode will not work.')
  }
})

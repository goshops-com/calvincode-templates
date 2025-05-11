const express = require('express');
const http = require('http');
const https = require('https');
const app = express();
const PORT = process.env.PORT || 8000;

// Simple middleware to add iframe headers
app.use((req, res, next) => {
  // Allow embedding from build.calvincode.ai
  res.removeHeader('X-Frame-Options'); // Remove any existing X-Frame-Options
  res.setHeader('Content-Security-Policy', "frame-ancestors 'self' build.calvincode.ai *.calvincode.ai");
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  next();
});

// Instead of redirecting, proxy the root request
app.get('/', (req, res) => {
  const token = '3da70c76398646a43ed57d31500bae627956b7409ad6f537';
  
  const options = {
    hostname: 'jupyter.apps.calvincode.net',
    port: 443,
    path: `/tree/${process.env.PROJECT_ID}?token=${token}`,
    method: req.method,
    headers: {
      ...req.headers,
      host: 'jupyter.apps.calvincode.net'
    }
  };

  const proxyReq = https.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res, { end: true });
  });

  proxyReq.on('error', (e) => {
    console.error(`Proxy request error: ${e.message}`);
    res.status(500).send('Proxy Error');
  });

  req.pipe(proxyReq, { end: true });
});

// Simple proxy implementation for other paths
app.use((req, res) => {
  const token = '3da70c76398646a43ed57d31500bae627956b7409ad6f537';
  const options = {
    hostname: 'jupyter.apps.calvincode.net',
    port: 443,
    path: req.url.includes('token=') ? req.url : `${req.url}${req.url.includes('?') ? '&' : '?'}token=${token}`,
    method: req.method,
    headers: {
      ...req.headers,
      host: 'jupyter.apps.calvincode.net'
    }
  };

  const proxyReq = https.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res, { end: true });
  });

  req.pipe(proxyReq, { end: true });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express(); // ✅ THIS LINE MUST BE HERE
const PORT = process.env.PORT || 3000;

app.use(cors()); // Allow all origins – customize if needed

// Proxy endpoint
app.get('/api/proxy', async (req, res) => {
  const targetUrl = req.query.url;

  if (!targetUrl) {
    return res.status(400).json({ error: 'Missing "url" query param' });
  }

  try {
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'application/json',
        'Referer': 'https://www.swiggy.com/',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });

    // Use text() first, in case Swiggy returns HTML or something unexpected
    const text = await response.text();

    try {
      const json = JSON.parse(text);
      res.json(json);
    } catch (e) {
      // fallback: send raw response
      res.send(text);
    }
  } catch (error) {
    console.error('Proxy error:', error.message);
    res.status(500).json({ error: 'Error fetching target API' });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});

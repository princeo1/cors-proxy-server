const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // Allow all origins – you can customize later

// Proxy endpoint
app.get('/api/proxy', async (req, res) => {
  const targetUrl = req.query.url;

  if (!targetUrl) {
    return res.status(400).json({ error: 'Missing "url" query param' });
  }

  try {
    const response = await fetch(targetUrl);
    const data = await response.json(); // Use response.text() if not JSON
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching target API' });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});

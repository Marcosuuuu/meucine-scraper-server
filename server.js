const express = require('express');
const app = express();
const scraper = require('./scraper');

app.get('/api/filme', async (req, res) => {
  const url = req.query.url;
  if (!url) {
    return res.status(400).json({ error: 'URL não fornecida' });
  }

  try {
    const link = await scraper(url);
    res.json({ url: link });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao extrair link do vídeo', details: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

const express = require('express');
const app = express();
const scraper = require('./scraper');

const PORT = process.env.PORT || 3000;

app.get('/api/filme', async (req, res) => {
  const url = req.query.url;

  if (!url) {
    return res.status(400).json({ error: 'URL não fornecida' });
  }

  try {
    const movieLink = await scraper(url);

    if (!movieLink) {
      return res.status(404).json({ error: 'Não foi possível extrair o link do vídeo' });
    }

    res.json({ stream_url: movieLink });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Erro ao extrair link do vídeo',
      details: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

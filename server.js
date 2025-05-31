const express = require('express');
const { getM3u8Url } = require('./scraper');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/api/filme', async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'Parâmetro url é obrigatório' });

  const m3u8 = await getM3u8Url(url);
  if (!m3u8) return res.status(404).json({ error: 'Link .m3u8 não encontrado' });

  res.json({ url: m3u8 });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

const express = require('express');
const app = express();
const extrairFilemoon = require('./scraper/filemoon-puppeteer');
const extrairPobreflix = require('./scraper/pobreflix-puppeteer');

app.get('/extrair', async (req, res) => {
  const url = req.query.url;
  if (!url) return res.json({ erro: 'URL ausente' });

  try {
    let resultado;
    if (url.includes('filemoon') || url.includes('26efp')) {
      resultado = await extrairFilemoon(url);
    } else if (url.includes('pobreflixtv.lat')) {
      resultado = await extrairPobreflix(url);
    } else {
      throw new Error('Site não suportado');
    }
    return res.json(resultado);
  } catch (err) {
    return res.json({ erro: err.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Servidor rodando em http://localhost:${port}`));

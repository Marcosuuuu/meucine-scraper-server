const express = require('express');
const app = express();
const puppeteer = require('puppeteer');

app.get('/extrair', async (req, res) => {
  const url = req.query.url;
  if (!url) return res.json({ erro: 'URL ausente' });

  try {
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    const links = await page.$$eval('video source', sources =>
      sources.map(source => source.src).filter(Boolean)
    );

    await browser.close();

    if (links.length === 0) return res.json({ erro: 'Player não encontrado' });
    return res.json({ video: links[0] });
  } catch (err) {
    return res.json({ erro: 'Erro ao extrair vídeo: ' + err.message });
  }
});

app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});
const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/api/filme', async (req, res) => {
  const videoPageUrl = req.query.url;
  if (!videoPageUrl) {
    return res.status(400).json({ error: 'URL do filme não fornecida.' });
  }

  try {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    let finalVideoLink = null;

    // Interceptar as requisições para achar a .m3u8
    page.on('request', (req) => {
      const url = req.url();
      if (url.includes('.m3u8') && !finalVideoLink) {
        finalVideoLink = url;
      }
    });

    await page.goto(videoPageUrl, { waitUntil: 'networkidle2', timeout: 0 });

    // Espera um pouco caso o .m3u8 demore
    await page.waitForTimeout(8000);

    await browser.close();

    if (!finalVideoLink) {
      return res.status(404).json({ error: 'Link .m3u8 não encontrado.' });
    }

    res.json({ stream_url: finalVideoLink });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Erro ao extrair link do vídeo',
      details: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

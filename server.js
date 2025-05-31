const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const PORT = process.env.PORT || 3000;

// Função que abre o navegador com o caminho correto no Render
async function getBrowser() {
  return await puppeteer.launch({
    headless: true,
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || puppeteer.executablePath(),
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
}

// Rota principal de teste
app.get('/', (req, res) => {
  res.send('✅ MeuCine Scraper Server está rodando!');
});

// Rota da API que extrai link de filme
app.get('/api/filme', async (req, res) => {
  const filmeUrl = req.query.url;

  if (!filmeUrl) {
    return res.status(400).json({ error: 'URL do filme não fornecida' });
  }

  try {
    const browser = await getBrowser();
    const page = await browser.newPage();
    await page.goto(filmeUrl, { waitUntil: 'domcontentloaded' });

    // ⚠️ Ajuste conforme o site (aqui é exemplo genérico)
    const movieLink = await page.evaluate(() => {
      const video = document.querySelector('video');
      return video ? video.src : null;
    });

    await browser.close();

    if (!movieLink) {
      return res.status(404).json({ error: 'Link de vídeo não encontrado' });
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

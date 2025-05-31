const puppeteer = require('puppeteer');

async function getMovieLink(url) {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: puppeteer.executablePath(), // usa o Chrome que o Puppeteer instalou
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'domcontentloaded' });

  // Exemplo: aqui você pode adaptar ao site que está raspando
  const movieLink = await page.evaluate(() => {
    // A lógica abaixo depende do site exato
    // Exemplo simples (ajuste conforme seu caso):
    const video = document.querySelector('video');
    return video ? video.src : null;
  });

  await browser.close();
  return movieLink;
}

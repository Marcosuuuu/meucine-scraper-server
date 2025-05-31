const puppeteer = require('puppeteer');

async function getVideoLink(cinegatoUrl) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.goto(cinegatoUrl, { waitUntil: 'networkidle2' });

  const m3u8Url = await page.evaluate(() => {
    const video = document.querySelector('video source');
    return video ? video.src : null;
  });

  await browser.close();
  return m3u8Url;
}

module.exports = getVideoLink;

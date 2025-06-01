const fs = require('fs');
const puppeteer = require('puppeteer');

async function scrapeAndSave(url) {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle2' });

  const link = await page.evaluate(() => {
    const iframe = document.querySelector('iframe');
    return iframe ? iframe.src : null;
  });

  await browser.close();

  if (link) {
    fs.writeFileSync('cache.json', JSON.stringify({
      lastUpdated: Date.now(),
      streamUrl: link
    }, null, 2));
  }

  return link;
}

module.exports = scrapeAndSave;

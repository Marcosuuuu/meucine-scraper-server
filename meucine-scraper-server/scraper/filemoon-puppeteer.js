const puppeteer = require('puppeteer');

module.exports = async function extrairFilemoon(url) {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
    await page.waitForSelector('video source', { timeout: 10000 });
    const src = await page.$eval('video source', el => el.src);
    await browser.close();
    return { link: src };
  } catch (e) {
    await browser.close();
    throw new Error('Erro no Filemoon: ' + e.message);
  }
};

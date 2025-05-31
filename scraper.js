const puppeteer = require("puppeteer");

module.exports = async function (url) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle2" });

  const iframeSrc = await page.$eval("iframe", (el) => el.src);
  await page.goto(iframeSrc, { waitUntil: "networkidle2" });

  const m3u8Link = await page.evaluate(() => {
    const video = document.querySelector("video");
    return video ? video.src : null;
  });

  await browser.close();
  return m3u8Link;
};

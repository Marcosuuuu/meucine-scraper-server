const axios = require('axios');
const cheerio = require('cheerio');

async function extrairFilemoon(url) {
  try {
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });

    const $ = cheerio.load(data);
    const scripts = $('script').map((i, el) => $(el).html()).get();

    const scriptComFonte = scripts.find(t => t.includes('"file":"'));
    const match = scriptComFonte?.match(/"file":"(.*?)"/);
    const link = match ? match[1].replace(/\\/g, '') : null;

    if (!link) throw new Error('Link do vídeo não encontrado');
    return { link };
  } catch (e) {
    return { erro: e.message };
  }
}

module.exports = extrairFilemoon;

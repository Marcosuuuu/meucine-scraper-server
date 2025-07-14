const axios = require('axios');
const cheerio = require('cheerio');

async function extrairVideoPobreflix(url) {
  try {
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
    });

    const $ = cheerio.load(data);
    const script = $('script[data-name="Player"]');

    const playerData = script.attr('data-player');
    if (!playerData) throw new Error('Player não encontrado');

    const decoded = Buffer.from(playerData, 'base64').toString('utf-8');
    const json = JSON.parse(decoded);

    const videoUrl = json.video;
    return videoUrl;
  } catch (error) {
    console.error('Erro ao extrair vídeo:', error.message);
    return null;
  }
}

module.exports = extrairVideoPobreflix;

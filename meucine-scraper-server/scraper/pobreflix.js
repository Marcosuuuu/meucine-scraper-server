const axios = require('axios');
const cheerio = require('cheerio');

async function buscarFilmesPobreflix() {
  try {
    const url = 'https://pobreflix.biz/'; // ou a página de filmes
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const filmes = [];

    $('.filme-item a').each((i, el) => {
      const link = $(el).attr('href');
      const titulo = $(el).find('.titulo').text().trim();
      const imagem = $(el).find('img').attr('src');
      filmes.push({ titulo, link, imagem });
    });

    return filmes;
  } catch (err) {
    console.error('Erro ao buscar:', err);
    return [];
  }
}

module.exports = buscarFilmesPobreflix;

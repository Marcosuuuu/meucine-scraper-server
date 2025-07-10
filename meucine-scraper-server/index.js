const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
app.use(cors());

app.get('/filme/:titulo', async (req, res) => {
  const titulo = req.params.titulo;
  const url = `https://pobreflix.biz/?s=${encodeURIComponent(titulo)}`;

  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const linkFilme = $('.result-item a').first().attr('href');

    if (!linkFilme) return res.status(404).json({ erro: 'Filme não encontrado' });

    const { data: filmeData } = await axios.get(linkFilme);
    const _$ = cheerio.load(filmeData);
    const scriptTag = _$('script:contains(".m3u8")').html();
    const match = scriptTag && scriptTag.match(/(https?:\/\/.*?\.m3u8)/);

    if (match && match[1]) {
      return res.json({ video: match[1] });
    } else {
      return res.status(404).json({ erro: 'Link .m3u8 não encontrado' });
    }
  } catch (err) {
    return res.status(500).json({ erro: 'Erro ao buscar filme' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
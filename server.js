const express = require("express");
const app = express();
const scraper = require("./scraper");

app.get("/api/filme", async (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).json({ error: "URL não fornecida" });

  try {
    const movieLink = await scraper(url);
    if (!movieLink) return res.status(404).json({ error: "Link não encontrado" });
    res.json({ stream_url: movieLink });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao extrair link", details: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});

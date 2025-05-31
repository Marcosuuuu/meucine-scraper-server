const puppeteer = require('puppeteer');

async function getMovieLink(url) {
  // Lançar o Puppeteer com o caminho do Chromium no Termux
  const browser = await puppeteer.launch({
    executablePath: '/data/data/com.termux/files/usr/lib/chromium/chromium-launcher.sh',  // Caminho do Chromium no Termux
    headless: true  // Rodar em modo sem cabeça (sem interface gráfica)
  });

  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'domcontentloaded' });  // Aguardar o carregamento do DOM

  // Extrair as informações de providers de streaming
  const movieLink = await page.evaluate(() => {
    // Imprime o conteúdo completo de window.__NEXT_DATA__ no console para depuração
    console.log(window.__NEXT_DATA__);
    
    const jsonData = window.__NEXT_DATA__;  // Esse objeto contém o conteúdo que você mostrou no log
    
    if (jsonData && jsonData.props && jsonData.props.pageProps) {
      // Tenta acessar os provedores de streaming
      const providers = jsonData.props.pageProps.movieData.providers;
      if (providers && providers.stream) {
        // Se encontrar provedores, retorna o link do primeiro provedor encontrado
        return providers.stream[0].provider_link;  // Pega o link do primeiro provedor
      }
    }
    return null;  // Caso não encontre nada, retorna null
  });

  await browser.close();  // Fechar o navegador após pegar o link
  return movieLink;
}

// Exemplo de uso do código com a URL do filme que você deseja pegar o link
const movieURL = 'https://www.ahshow.tv/movie/minha-culpa-1010581';  // Substitua pela URL do filme real
getMovieLink(movieURL)
  .then(link => {
    if (link) {
      console.log('Link do filme:', link);
    } else {
      console.log('Não foi possível encontrar o link do filme.');
    }
  })
  .catch(err => {
    console.error('Erro ao obter o link:', err);
  });

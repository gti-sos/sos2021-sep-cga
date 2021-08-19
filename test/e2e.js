const puppeteer = require('puppeteer');
const url = 'e2e_capturas/';

(async () => {
  const browser = await puppeteer.launch();

    const page = await browser.newPage();
   // await page.setViewport({ width: 1366, height: 768});

    console.log("-- Test 1 - Cargar la pagina principal");
    //await page.goto('http://localhost:10000/');
    await page.goto('http://google.com/');
    await page.screenshot({ path: url + 'PaginaPrincipal.png' });

    console.log("-- Test 1 - Acabado\n-----------------");


    await browser.close();
})();
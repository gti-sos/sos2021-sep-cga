const puppeteer = require('puppeteer');
const url = './e2e_capturas/';
const fs = require('fs');

if (!fs.existsSync("e2e_capturas")){
  fs.mkdirSync("e2e_capturas");
}

(async () => {
  const browser = await puppeteer.launch();

    const page = await browser.newPage();

    console.log("-- Test 1 - Cargar la pagina principal");
    await page.goto('http://localhost:10000/');
    //await page.goto('https://sos2021-sep-cga.herokuapp.com/');
    await page.screenshot({ path: url + 'PaginaPrincipal.png' });

    console.log("-- Test 1 - Acabado\n-----------------");


    await browser.close();
})();
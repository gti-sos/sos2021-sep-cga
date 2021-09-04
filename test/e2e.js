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
    //await page.goto('http://localhost:10000/');
    await page.goto('https://sos2021-sep-cga.herokuapp.com/');
    await page.screenshot({ path: url + 'PaginaPrincipal.png' });

    console.log("-- Test 1 - Acabado\n-----------------");

    //  -------- Test 2 - The charging data, deleting data works and the table too?.

    console.log("-- Test 2 - The loadInitialData works and the table too?");
    await page.click("#link-to-table", { waitUntil: "networkidle0" });

    await page.waitForTimeout(1000);
    await page.screenshot({ path: url + 'cuts_api_02.png' });
    console.log("   The table works...");


    await browser.close();
})();
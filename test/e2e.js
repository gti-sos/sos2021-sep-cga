const puppeteer = require('puppeteer');
const url = './e2e_capturas/';
const fs = require('fs');

if (!fs.existsSync("e2e_capturas")){
  fs.mkdirSync("e2e_capturas");
}

(async () => {
  const browser = await puppeteer.launch();

    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });


    console.log("-- Test 1 - Cargar la pagina principal");
    //await page.goto('http://localhost:10000/');
    await page.goto('https://sos2021-sep-cga.herokuapp.com/');
    await page.screenshot({ path: url + 'PaginaPrincipal.png' });

    console.log("-- Test 1 - Acabado\n-----------------");

    //  -------- Test 2 - The charging data, deleting data works and the table too?.

    console.log("-- Test 2 - ¿ La tabla carga los datos ?");
    await page.click("#link-to-table", { waitUntil: "networkidle0" });
    await page.click("#open", { waitUntil: "networkidle0" });
    await page.click("#charge", { waitUntil: "networkidle0" });

    await page.waitForTimeout(1000);
    await page.screenshot({ path: url + 'TablaCargada.png' });
    console.log("La tabla carga los datos correctamente...");

    console.log("-- Test 3 - ¿ La tabla elimina los datos ?");
    await page.click("#delete", { waitUntil: "networkidle0" });

    await page.waitForTimeout(1500);
    await page.screenshot({ path: url + 'TablaEliminada.png' });
    console.log("La tabla elimina los datos correctamente...");

    console.log("-- Test 4 - ¿ La tabla inserta los datos ?");

    await page.type('#ciudad', 'Prueba_Ciudad');
    await page.type('#anyo', '2018');
    await page.type('#oro', '7');
    await page.type('#plata', '10000');
    await page.type('#bronze', '852');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: url + 'datos_insertados.png' });

    await page.click("#insert", { waitUntil: "networkidle0" });


    await browser.close();
})();
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
    await page.type('#bronce', '852');
    await page.waitForTimeout(500);
    await page.click("#insert", { waitUntil: "networkidle0" });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: url + 'Datos_insertados.png' });
    console.log("Datos introducidos correctamente...");

    console.log("-- Test 5 - Eliminar Dato Nuevo");
    await page.waitForTimeout(1000);
    await page.click("#eliminar_dato_nuevo", { waitUntil: "networkidle0" });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: url + 'Dato_Nuevo_Eliminado.png' });
    console.log("Dato eliminado correctamente...");

    console.log("-- Test 6 - Buscar Datos");
    await page.click("#charge", { waitUntil: "networkidle0" });
    await page.click("#btn-right");
    await page.click("#filtroCiudad");
    await page.type('#datofiltroCiudad', 'Tokyo');
    await page.waitForTimeout(1000);
    
    await page.click("#filtro");
    await page.waitForTimeout(2000);
    await page.click("#open", { waitUntil: "networkidle0" });
    await page.click("#btn-right");
    await page.click("#filtroCiudad");
    await page.type('#datofiltroCiudad', 'Tokyo');
    await page.waitForTimeout(1000);
    await page.click("#filtro");
    await page.waitForTimeout(2000);
    await page.screenshot({ path: url + 'DatosFiltrados.png'});
    console.log("Dato encontrado correctamente...");

    console.log("-- Test 7 - HighCharts");
    await page.goto('https://sos2021-sep-cga.herokuapp.com/');
    await page.click("#link-to-table", { waitUntil: "networkidle0" });
    await page.click("#hc");
    await page.waitForTimeout(2000);
    await page.screenshot({ path: url + 'HighchartsGraph.png'});
    console.log("Gráfico Highcharts generado...");

    console.log("-- Test 8 - QuickCharts");
    await page.click("#back");
    await page.click("#qc");
    await page.waitForTimeout(2000);
  await page.screenshot({ path: url + 'QuickChartsGraph.png'});
    console.log("Gráfico Quickcharts generado...");
    
    await browser.close();
})();
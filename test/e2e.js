const puppeteer = require('puppeteer');
const url = '../e2e_capturas';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  await page.goto('http://localhost:10000/#/info');
  await page.click('body > main > main > main > nav > button');
  await page.waitForTimeout(1000);
  await page.click("body > main > main > main > nav > div > ul > li:nth-child(1) > a");
  await page.waitForTimeout(100);
  await page.screenshot({ path: url + 'FoodConsumption.png' });

 //Captura tabla
  /*await page.click("body > main > main > button:nth-child(9)");
  await page.waitForTimeout(1000);
  await page.screenshot({ path: url + 'TablaFood.png' });

  //Añadir dato en tabla
  console.log("Mete datos");
  await page.focus('#paisFood');
  await page.keyboard.type("Andorra");

  await page.focus('#anyoFood');
  await page.keyboard.type("2019");

  await page.focus('#caloryFood');
  await page.keyboard.type("123");

  await page.focus('#gramFood');
  await page.keyboard.type("123");

  await page.focus('#dailycalFood');
  await page.keyboard.type("4321");

  await page.focus('#dailygramFood');
  await page.keyboard.type("4321");

  console.log("Datos metidos");

    await page.screenshot({ path: url + 'datosAñadir.png' });
    await page.waitForTimeout(1000); 
    await page.click("#addFood");

    await page.waitForTimeout(2000);  

    await page.screenshot({ path: url + 'DatosAñadidos.png'});

    //Borrar dato
    await page.click("body > main > main > div > div.modal.show.d-block > div > div > div.modal-body > main > div.table-responsive > table > tbody > tr:nth-child(2) > td:nth-child(7) > button");
    await page.waitForTimeout(1000);  
    await page.screenshot({ path: url + 'DatoEliminado.png'});

    //Filtrar datos
    await page.click("#btn-right");
    await page.click("#filtroPais");
    await page.focus('#datoFiltroPais');
    await page.keyboard.type("China");
    await page.waitForTimeout(500);

    await page.click("body > main > main > div > div.modal.show.d-block > div > div > div.modal-body > main > div.mt-3 > div > div.popover-body > ul > button.btn.btn-secondary");
    

    await page.screenshot({ path: url + 'DatosFiltrados.png'});


    //Carga datos iniciales
    await page.click('body > main > main > div > div.modal.show.d-block > div > div > div.modal-body > main > div.table-responsive > table > thead > tr:nth-child(1) > td:nth-child(1) > button');
    await page.waitForTimeout(1000); 
    await page.screenshot({ path: url + 'DatosInicialesCargados.png'});
    await page.click(" body > main > main > div > div.modal.show.d-block > div > div > div.modal-header > button");
    await page.waitForTimeout(1000); 
    
   
    //Mostrar mi gráfica 
  await page.click("body > main > main > button:nth-child(12)");
  await page.waitForTimeout(1000);
  await page.screenshot({ path: url + 'GraficaFusionCharts.png' });
  await page.click("body > main > main > button");
  await page.waitForTimeout(1000);  

  //Mostrar página Integraciones
  await page.click("body > main > main > div > button:nth-child(9)");
  await page.waitForTimeout(1000); 
  await page.screenshot({ path: url + 'Integraciones.png' });

  //Mostrar Integración API Externa 1
  await page.click("body > main > main > div > ul:nth-child(5) > button:nth-child(7)");
  await page.waitForTimeout(1000);
  await page.screenshot({ path: url + 'APIExt1.png' });

 */


  await browser.close();
})();
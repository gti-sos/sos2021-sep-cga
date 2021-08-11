<script>
    import Header from '../Header.svelte';
    import FusionCharts from 'fusioncharts';
    import Charts from 'fusioncharts/fusioncharts.charts';
    import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
    import SvelteFC, { fcRoot } from 'svelte-fusioncharts';
    import {
        onMount
    } from "svelte";
    import Button from "sveltestrap/src/Button.svelte";
    
    fcRoot(FusionCharts, Charts, FusionTheme);
    const paises = new Set();
    let categorias=[];
	let gramperperson = [];
	let caloryperperson = [];
	let arrPaises =[];
    let data = [];
    var dict ={};
    let data2=[];
    let medallasOro=[];
    let medallasPlata=[];
    let medallasBronce=[];
    var dataSource={};
    var BASE_CONTACT_API_PATH= "/api/v2";
    async function getData(){
        console.log("Fetching data...");
        const res = await fetch(BASE_CONTACT_API_PATH + "/foodconsumption-stats?year=2011");
        const res2 = await fetch("https://sos2021-sep-cga.herokuapp.com/api/v2/olimpic-stats?city=Rio&year=2016");
        
        if(res.ok){
            console.log("Ok.");
            const json = await res.json();
            const json2 = await res2.json();
          
            data=json;
            data2=json2;
           
            console.log(`We have received ${data.length} data points.`);
			let i=0;
            let e=0;
			while(e<data2.length){
                
                    paises.add(data2[e].country);
                    console.log(data2[e]["gold_medal"])
                e++;
            }
			while(i<data.length){
				paises.add(data[i].country);
				 
				i++;
			
			}
            arrPaises = Array.from(paises);
           
            for(let p=0; p<arrPaises.length;p++ ){
                if(!dict[arrPaises[p]]){
                    dict[arrPaises[p]]={medallasOro : null, medallasPlata: null, medallasBronce:null, gramperperson:null, caloryperperson:null}
                }
                console.log(dict);
            }
           
                let d=0;
                let d2=0;
                let paisesd = Object.keys(dict);
                
                    
                    while(d<data.length){
                    console.log(paisesd.includes(data[d].country));
                    if(paisesd.includes(data[d].country)){
                        
                        dict[data[d].country]['gramperperson']=data[d].gramperperson;
                        dict[data[d].country]['caloryperperson']=data[d].caloryperperson
                    }
                    d++
                }
                while(d2<data2.length){
                    if(paisesd.includes(data2[d2].country)){
    
                        dict[data2[d2].country]['medallasOro']=data2[d2]["gold_medal"];
                        dict[data2[d2].country]['medallasPlata']=data2[d2]["silver_medal"];
                        dict[data2[d2].country]['medallasBronce']=data2[d2]["bronze_medal"];
                        
                    }
                    d2++;  
                }
                for(let p=0; p<paisesd.length; p++){
                    gramperperson.push({value: dict[paisesd[p]]['gramperperson']});
				    caloryperperson.push({value: dict[paisesd[p]]['caloryperperson']});
                    medallasOro.push({value: dict[paisesd[p]]['medallasOro']});
                    medallasPlata.push({value: dict[paisesd[p]]['medallasPlata']});
                    medallasBronce.push({value: dict[paisesd[p]]['medallasBronce']});
                    
                }
               
                for(let pa=0; pa<arrPaises.length; pa++){
                    categorias.push({label: arrPaises[pa]});
                }
            
        }else{
            console.log("Error!");
        }
        dataSource = {
      "chart": {
        "caption": "Integración con estadísticas de divorcios",
        "subcaption": "Datos de 2011",
        "numbersuffix": "",
        "showsum": "1",
        "plottooltext": "$label:  <b>$dataValue</b> $seriesName",
        "theme": "fusion",
        "drawcrossline": "1"
      },
      "categories": [
        {
          "category": categorias
        }
      ],
      "dataset": [
        {
          "seriesname": "Gramos por persona",
          "data": gramperperson
        },
        {
          "seriesname": "Calorías por persona",
          "data": caloryperperson
        },
        {
          "seriesname": "Tasa de matrimonios",
          "data": medallasOro
        },
        {
          "seriesname": "Tasa de divorcios",
          "data": medallasPlata
        },
        {
          "seriesname": "Porcentaje de proporcion matrimonio/divorcio",
          "data": medallasBronce
        }
      ]
    };
        cargarConf();
    }
    onMount(getData);
    var chartConfigs={};
    async function cargarConf(){
        chartConfigs = {
            type: 'stackedcolumn2d',
            width: 1300,  
            height: 600,
            dataFormat: 'json',
            dataSource
    };
}
    </script>
    <Header/>
  
    <br>
    <Button outline color="secondary" onclick="window.location.href='#/integrations'">Volver</Button>
    <SvelteFC {...chartConfigs} />
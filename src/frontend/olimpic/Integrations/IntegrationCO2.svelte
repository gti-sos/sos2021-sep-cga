<script>
    
    import Header from '../../Header.svelte';
    import Button from "sveltestrap/src/Button.svelte";
    import {
        onMount
    } from "svelte";
    
    let array = [];
    let array1 = [];
    let array2 = [];
    let cont=0;
    async function loadGraph() {
        let res1 = await fetch("https://daily-atmosphere-carbon-dioxide-concentration.p.rapidapi.com/api/co2-api", {
	        "method": "GET",
	        "headers": {
		        "x-rapidapi-key": "f644a4df9fmsh4cbfb9967f1e803p1b0e36jsna60d34ae1c3b",
		        "x-rapidapi-host": "daily-atmosphere-carbon-dioxide-concentration.p.rapidapi.com"
	        }
            });
        let res2 = await fetch('/api/v2/olimpic-stats');
        
        let res_data1 = await res1.json();
        let res_data2 = await res2.json();
        for(let i = 0; i < 4; i++) {
            if(i < 4){
                array1.push(parseInt(res_data1.co2[i].year));
                array.push(res_data1.co2[i].cycle + " - " + ' cantidad media de CO2 en el Aire');
            }
        }
        console.log(res_data2);
        for(let j = 0; j < 24; j++){
            cont+=res_data2[j].gold_medal;
            cont+=res_data2[j].silver_medal;
            cont+=res_data2[j].bronze_medal;
        }
        
        array1.push(cont);
        array.push('Número de medallas totales ');
        
        var options = {
          series: array1,
          chart: {
          width: 600,
          type: 'pie',
        },
        labels: array,
        responsive: [{
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: 'bottom'
            }
          }
        }]
        };
        var chart = new ApexCharts(document.querySelector("#chart"), options);
        chart.render();
    }
</script>

<main>
    <Header/>
    <br>
    <br>
    <Button outline color="secondary" onclick="window.location.href='#/integrations'">Volver</Button>
    <br>
    <br>
    <div id="chart">
        Gráfico que muestra la cantidad media de CO2 en el aire durante el año 2011 y el total de medallas en nuestra historia
    </div>
</main>

<svelte:head>
    <script src="https://cdn.jsdelivr.net/npm/apexcharts" on:load={loadGraph}></script>
</svelte:head>
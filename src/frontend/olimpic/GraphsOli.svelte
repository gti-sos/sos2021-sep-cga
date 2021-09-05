<script>

    import Header from '../Header.svelte';
    import Button from "sveltestrap/src/Button.svelte";
    import {
        onMount
    } from "svelte";

    let MyData = [];
    let Yaxis = [];
    let medallasOro = [];
    let medallasPlata = [];


    async function loadGraph(){
        const res = await fetch("/api/v2/olimpic-stats");
        if(res.ok){
            MyData = await res.json();
            console.log(MyData);
            console.log(JSON.stringify(MyData, null, 2))
            MyData.forEach(data => {
                Yaxis.push(data["city"] + "-" + data.year);
                medallasOro.push(data.gold_medal);
                medallasPlata.push(data.silver_medal);
            });
        }else{
            console.log("Error loading cuts");
        }
        Highcharts.chart('container', {
    chart: {
        type: 'bar'
    },
    title: {
        text: 'Medallas de España en los Juegos Olímpicos'
    },
    xAxis: {
        categories: Yaxis,
        title: {
            text: 'Ciudad-Año'
        }
    },
    yAxis: {
        min: 0,
        title: {
            text: '',
            align: 'high'
        },
        labels: {
            overflow: 'justify'
        }
    },
    plotOptions: {
        bar: {
            dataLabels: {
                enabled: true
            }
        }
    },
    legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'top',
        x: -40,
        y: 80,
        floating: true,
        borderWidth: 1,
        backgroundColor:
            Highcharts.defaultOptions.legend.backgroundColor || '#FFFFFF',
        shadow: true
    },
    credits: {
        enabled: false
    },
    series: [{
        name: 'Medallas de Oro',
        data: medallasOro
    },{
        name: 'Medallas de Plata',
        data: medallasPlata
    }]
    });
  }
</script>

<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js" on:load="{loadGraph}"></script>
    <script src="https://code.highcharts.com/modules/series-label.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/export-data.js"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js"></script>
</svelte:head>

<main>
    <Header/>
    <br>
    <br>
    <Button id='back' outline color="secondary" onclick="window.location.href='#/olimpic-stats'">Volver</Button>
        <div style="margin:auto;"> 
        <figure class="highcharts-figure">
            <div id="container"></div>
            <p class="highcharts-description">
               Gráfico de barras sobre las medallas de España en los Juegos Olímpicos.
            </p>
        </figure>  
    </main>
    
    
    <style>
        .highcharts-figure {
          min-width: 100%;
          max-width:100%;
          margin: 1em auto;
        }
        #container {
          height: 400px;
        }
        
    </style>
<script>

    import Header from '../Header.svelte';
    import Button from "sveltestrap/src/Button.svelte";
    import {
        onMount
    } from "svelte";

    let dataOlimpic = [];
    let datosAux = [];
    let datosAux1 = [];
    let datosAux2 = [];
    async function loadGraph() {
        let res1 = await fetch("https://coinpaprika1.p.rapidapi.com/tags/blockchain-service", {
	"method": "GET",
	"headers": {
		"x-rapidapi-key": "f644a4df9fmsh4cbfb9967f1e803p1b0e36jsna60d34ae1c3b",
		"x-rapidapi-host": "coinpaprika1.p.rapidapi.com"
	}
});
        let res2 = await fetch('/api/v2/olimpic-stats');
        let res_data1 = await res1.json()
        let res_data2 = await res2.json()
        console.log(res_data1)
        res_data2.forEach((data) => {
            dataOlimpic.push(data.year);
            dataOlimpic.push(data.gold_medal);
            datosAux.push(dataOlimpic);
            dataOlimpic = [];
        });
        datosAux2.push(res_data1.coin_counter);
        datosAux2.push(res_data1.ico_counter);
        datosAux1.push(datosAux2);
        console.log(datosAux1);
        Highcharts.chart('container', {
    chart: {
        type: 'scatter',
        zoomType: 'xy'
    },
    title: {
        text: 'Gráfica que contiene las notas de corte del grado de ingeniería informática de la US en distintos años, y el peso y el id de un jugador aleatorio de la NBA'
    },
    xAxis: {
        title: {
            enabled: true,
        },
        startOnTick: true,
        endOnTick: true,
        showLastLabel: true
    },
    yAxis: {
        title: {
        }
    },
    legend: {
        layout: 'vertical',
        align: 'left',
        verticalAlign: 'top',
        x: 100,
        y: 70,
        floating: true,
        backgroundColor: Highcharts.defaultOptions.chart.backgroundColor,
        borderWidth: 1
    },
    plotOptions: {
        scatter: {
            marker: {
                radius: 5,
                states: {
                    hover: {
                        enabled: true,
                        lineColor: 'rgb(100,100,100)'
                    }
                }
            },
            states: {
                hover: {
                    marker: {
                        enabled: false
                    }
                }
            },
            tooltip: {
                headerFormat: '<b>{series.name}</b><br>',
                pointFormat: '{point.x}, {point.y}'
            }
        }
    },
    series: [{
        name: 'Año y nota de corte de grados',
        color: 'rgba(223, 83, 83, .5)',
        data: datosAux
    },
    {
        name: res_data1.id + ' ' + res_data1.name,
        color: 'rgba(250, 83, 83, .5)',
        data: datosAux1
    }]
});
    }
</script>

<main>
    <Header/>
        <br>
        <br>
        <Button outline color="secondary" onclick="window.location.href='#/integrations'">Volver</Button>
        <br>
        <br>
    <figure class="highcharts-figure">
        <div id="container"></div>
        <p class="highcharts-description">
            
        </p>
    </figure>
</main>

<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"on:load="{loadGraph}"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/export-data.js"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js"></script>
    
</svelte:head>
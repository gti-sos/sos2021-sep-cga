<script>

    import{
        onMount
    } from "svelte";

    let MyData = [];
    let ejeX = [];
    let medallasOro = [];
    let medallasPlata = [];


    async function loadGraph(){
        const res = await fetch("/api/v2/olimpic-stats");
        if(res.ok){
            MyData = await res.json();
            console.log(MyData);
            console.log(JSON.stringify(MyData, null, 2))
            MyData.forEach(data => {
                ejeX.push(data["city"] + "-" + data.year);
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
        text: 'Notas de corte del grado de Ingeniería Informática según el año'
    },
    xAxis: {
        categories: ejeX,
        title: {
            text: 'Grado-año'
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
    <figure class="highcharts-figure">
        <div id="container"></div>
    </figure>
</main>
<script>
    let frase;
    async function loadGraph(){
        let Datas = [];
        let aux;
        let myData={
            name: 'Medallas de Oro',
            data: []
        };
        let res1 = await fetch("https://pokemon-go1.p.rapidapi.com/pokemon_encounter_data.json", {
	"method": "GET",
	"headers": {
		"x-rapidapi-key": "f644a4df9fmsh4cbfb9967f1e803p1b0e36jsna60d34ae1c3b",
		"x-rapidapi-host": "pokemon-go1.p.rapidapi.com"
	}
});
        let res2 = await fetch('/api/v2/olimpic-stats')
        
        let res_data1 = await res1.json()
        let res_data2 = await res2.json()
        console.log(res_data1)
        aux = 'Número en la pokedex:' + res_data1[0].pokemon_id  + " - " +'Nombre del Pokemon:' + res_data1[0].pokemon_name;
        let myData1={
            name: aux,
            data: [(res_data1[0].max_pokemon_action_frequency + res_data1[0].min_pokemon_action_frequency)/2] 
        };
        res_data2.forEach((data) => {
            if(data.year == 2016){
                myData['data'].push({
                    name:data.city  + " " +data.year,
                    value: data.gold_medal
            });
            }
        });
        
        Datas.push(myData);
        Datas.push(myData1);
        console.log(Datas)
        Highcharts.chart('container', {
    chart: {
        type: 'packedbubble',
        height: '100%'
    },
    title: {
        text: 'Gráfica que contiene las medallas de oro de Rio 2016 y la probabilidad media de captura del primer pokemon de Pokemon GO'
    },
    tooltip: {
        useHTML: true,
        pointFormat: '<b>{point.name}:</b> {point.value}'
    },
    plotOptions: {
        packedbubble: {
            minSize: '30%',
            maxSize: '100%',
            zMin: 0,
            zMax: 1000,
            layoutAlgorithm: {
                splitSeries: false,
                gravitationalConstant: 0.02
            },
            dataLabels: {
                enabled: true,
                format: '{point.name}',
                filter: {
                    property: 'y',
                    operator: '>',
                    value: 250
                },
                style: {
                    color: 'black',
                    textOutline: 'none',
                    fontWeight: 'normal'
                }
            }
        }
    },
    series: Datas
});
    }
    
</script>

<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/highcharts-more.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js"on:load="{loadGraph}"></script>    
</svelte:head>


<main>

    <figure class="highcharts-figure">
        <div id="container"></div>
        <p class="highcharts-description">
        
    </figure>
</main>

<style>
    .highcharts-figure {
    min-width: 320px; 
    max-width: 1000px;
    margin: 1em auto;
    }
</style>
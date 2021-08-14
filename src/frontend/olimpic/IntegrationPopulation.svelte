<script>
    let aux = 0;
    let Mexico = [];
    let stringMexico;
    let numMedallas=0;
    async function loadGraph(){
        let res1 = await fetch("https://world-population.p.rapidapi.com/population?country_name=Mexico", {
	"method": "GET",
	"headers": {
		"x-rapidapi-key": "f644a4df9fmsh4cbfb9967f1e803p1b0e36jsna60d34ae1c3b",
		"x-rapidapi-host": "world-population.p.rapidapi.com"
	}
});
        let res2 = await fetch('/api/v2/olimpic-stats');
        
        let res_data1 = await res1.json();
        let res_data2 = await res2.json();
        res_data2.forEach((data) => {
            if(data.year >= 2000){
                numMedallas += data.gold_medal;
            }
        })
        res_data1.data.forEach((data) => {
                stringMexico = 'La población total en' +  data.body.country_name;
                Mexico.push(data);
        });
        let poblacionMexico = Mexico[0].body.population;
        Highcharts.chart('container', {
  chart: {
    type: 'pie'
  },
  series: [{
    colorByPoint: true,
    data: [{
      name: stringMexico,
      y: poblacionMexico,
      sliced: true,
      selected: true
    }, {
      name: 'Presentados selectividad 2020',
      y: numMedallas
    }
    ]
  }]
});
    }
    
</script>

<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js" on:load="{loadGraph}"></script>
</svelte:head>


<main>


    <figure class="highcharts-figure">
        <div id="container"></div>
        <p class="highcharts-description">
            Gráfica que muestra el nº de fallecidos totales en Andalucía por covid a día de hoy y el nº de presentados a selectividad en Sevilla en 2020
        </p>
    </figure>
</main>
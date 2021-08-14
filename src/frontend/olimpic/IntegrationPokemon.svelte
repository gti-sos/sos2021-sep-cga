<script>
    let aux = 0;
    let Pokemon = [];
    let stringPokemon;
    let medallasOro;
    async function loadGraph(){
        let res1 = await fetch("https://pokemon-go1.p.rapidapi.com/pokemon_encounter_data.json", {
	"method": "GET",
	"headers": {
		"x-rapidapi-key": "f644a4df9fmsh4cbfb9967f1e803p1b0e36jsna60d34ae1c3b",
		"x-rapidapi-host": "pokemon-go1.p.rapidapi.com"
	}
});
        let res2 = await fetch('/api/v2/olimpic-stats');
        
        let res_data1 = await res1.json();
        let res_data2 = await res2.json();
        res_data2.forEach((data) => {
            if(data.year == 1992){
                medallasOro = data.gold_medal;
            }
        })
        res_data1.data.forEach((data) => {
            if(data.pokemon_id == 6 && data.form == "Copy_2019"){
                stringPokemon = 'El nombre es ' +  data.pokemon_name + 'y su número en la pokedex es el ' + data.pokemon_id;
                Pokemon.push(data);
            }
        })
        let pok = Pokemon[0].pokemon_id;
        Highcharts.chart('container', {
  chart: {
    type: 'pie'
  },
  series: [{
    colorByPoint: true,
    data: [{
      name: stringPokemon,
      y: pok,
      sliced: true,
      selected: true
    }, {
      name: 'Números de medallas en Barcelona 92',
      y: medallasOro
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
<script>

    import Header from '../Header.svelte';
    import Button from "sveltestrap/src/Button.svelte";
    import {
        onMount
    } from "svelte";

    let aux = 0;
    let Calorias = [];
    let stringComida;
    let numMedallasOro=0;
    async function loadGraph(){
        let res1 = await fetch("https://food-calorie-data-search.p.rapidapi.com/api/search?keyword=apple", {
	"method": "GET",
	"headers": {
		"x-rapidapi-key": "f644a4df9fmsh4cbfb9967f1e803p1b0e36jsna60d34ae1c3b",
		"x-rapidapi-host": "food-calorie-data-search.p.rapidapi.com"
	}
});
        let res2 = await fetch('/api/v2/olimpic-stats');
        
        let res_data1 = await res1.json();
        let res_data2 = await res2.json();
        res_data2.forEach((data) => {
                numMedallasOro += data.gold_medal;
        });
        res_data1.forEach((data) => {
            if(data.id == 839){
                stringComida = 'Calorías totales en ' +  data.shrt_desc;
                Calorias.push(data);
            }
        });
        let numCalorias = Calorias[0].energ_kcal;
        Highcharts.chart('container', {
  chart: {
    type: 'pie'
  },
  series: [{
    colorByPoint: true,
    data: [{
      name: stringComida,
      y: numCalorias,
      sliced: true,
      selected: true
    }, {
      name: 'Medallas de Oro',
      y: numMedallasOro
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
    <Header/>
    <br>
    <br>
    <Button outline color="secondary" onclick="window.location.href='#/integrations'">Volver</Button>
    <br>
    <br>

    <figure class="highcharts-figure">
        <div id="container"></div>
        <p class="highcharts-description">
            Gráfica que muestra el nº de medallas de oro totales y el nº de calorías de un plato hecho a base de manzana
        </p>
    </figure>
</main>
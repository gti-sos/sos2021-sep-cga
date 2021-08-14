<script>

    import Header from '../Header.svelte';
    import Button from "sveltestrap/src/Button.svelte";
    import {
        onMount
    } from "svelte";

    async function loadData() {
        let res1 = await fetch('https://sos2021-11.herokuapp.com/api/v2/smoking_stats/');
        await fetch('https://sos2021-11.herokuapp.com/api/v2/smoking_stats/loadInitialData');
        let res2 = await fetch('https://sos2021-sep-cga.herokuapp.com/api/v2/olimpic-stats?city=Rio&year=2016')
        
        let res_data1 = await res1.json()
        let res_data2 = await res2.json()
        let smokingPopulation = [];
        let olimpic = [];
        let dat = [];
        let total_label = [];
        let aux = 0;
        res_data1.forEach((data) => {
            if(data.country == "Spain" && aux == 0){
                smokingPopulation.push(data.smoking_population);
                total_label.push(data.country+"-Porcentaje fumadores")
                aux = 1;
            }
        })
        
        smokingPopulation.forEach((data) => {
           dat.push(data);
        })
        res_data2.forEach((data) => {
            if(data.year == 2016){
                olimpic.push(data.gold_medal);
                total_label.push(data.city+"-Número de medallas de Oro");
            }
        })
        
        olimpic.forEach((data) => {
           dat.push(data);
        })
        console.log(dat)
        let c = {
  type: 'polarArea',
  data: {
    datasets: [
      {
        data: dat,
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(255, 159, 64, 0.5)',
        ],
        label: 'My dataset',
      },
    ],
    labels: total_label,
  },
  options: {
    legend: {
      position: 'right',
    },
    title: {
      display: true,
      text: 'Chart.js Polar Area Chart',
    },
  },
}
let url = "https://quickchart.io/chart?c="+JSON.stringify(c)
    let res = await fetch(url)
    if(res.ok){
        console.log("Respuesta OK")
        console.log(res)
        let url = res["url"]
        document.getElementById("graph").src = url;
    }else{
        console.log("Error")
    }    
    }
    
    loadData();
</script>

<main>
  <Header/>
  <br>
  <br>
  <Button outline color="secondary" onclick="window.location.href='#/integrations'">Volver</Button>
  <br>
  <br>
  <h1>Gráfico que muestra el porcentaje de fumadores y el número de medallas de oro en 2016.</h1>
    <body>
        <img src="" id="graph"/>
    </body>
</main>

<svelte:head>

</svelte:head>
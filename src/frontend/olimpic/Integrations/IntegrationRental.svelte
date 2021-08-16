<script>

    import Header from '../../Header.svelte';
    import Button from "sveltestrap/src/Button.svelte";
    import {
        onMount
    } from "svelte";

    let array = [];
    let arrayLabel = [];
    async function loadChart(){
        let res1 = await (await fetch("/olimpicAPI/proxyRequest/rentals"));
        await fetch('https://sos2021-07.herokuapp.com/api/v1/rentals/loadInitialData');
        let res2 = await fetch('/api/v2/olimpic-stats?city=Tokyo&year=2021');
        let res_data1 = await res1.json()
        let res_data2 = await res2.json()
        res_data1.forEach((data) => {
            array.push(data.rent);
            arrayLabel.push(data.province + " " + data.year);
        });
        res_data2.forEach((data) => {
            array.push(data.gold_medal + data.silver_medal + data.bronze_medal);
            arrayLabel.push(data.city + " " + data.year);
        });
const data = {
  labels: arrayLabel,
  datasets: [
    {
      label: 'Dataset 1',
      data: array,
      backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ]
    }
  ]
};
        const config = {
  type: 'doughnut',
  data: data,
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Gráfica que muestra el nº de alquileres en distintas zonas de España y el número totales de medallas'
      }
    }
  },
};
        var ctx = document.getElementById('myChart').getContext('2d');
        var myChart = new Chart(ctx, config);
    }
</script>

<main>
  <Header/>
        <br>
        <br>
        <Button outline color="secondary" onclick="window.location.href='#/integrations'">Volver</Button>
        <br>
        <br>  
  <canvas id="myChart" width="400" height="400"></canvas>

</main>

<svelte:head>
    <script src="https://cdn.jsdelivr.net/npm/chart.js" on:load={loadChart}></script>
</svelte:head>
<script>
    let array = [];
    let array1 = [];
    let array2 = [];
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
                array.push(res_data1.data[i].cycle + ' cycle');
            }
        }
        console.log(res_data2);
        for(let j = 0; j < 4; j++){
            array1.push(res_data2[j].gold_medal);
            array.push('Medallas de oro en el año ' + res_data2[j].year);
        }
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
    <h1>Gráfico que muestra el valor de varias criptomonedas en USD a día de hoy y los presentados en selectidad en Sevilla varios años</h1>
    <div id="chart"></div>
</main>

<svelte:head>
    <script src="https://cdn.jsdelivr.net/npm/apexcharts" on:load={loadGraph}></script>
</svelte:head>
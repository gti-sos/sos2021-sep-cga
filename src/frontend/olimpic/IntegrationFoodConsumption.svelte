<script>
    async function loadChart(){
        let res1 = await fetch('https://sos2021-10.herokuapp.com/api/v2/foodconsumption-stats');
        await fetch('https://sos2021-10.herokuapp.com/api/v2/loadInitialData');
        let res2 = await fetch("/api/v2/olimpic-stats?city=Barcelona&year=1992")
        let res_data1 = await res1.json()
        let res_data2 = await res2.json()
        let calorias = [];
        let medallasOro = [];
        let anyos = [];
        let total_label;
        let total_label2;
        res_data1.forEach((data) => {
                if(data.country == "United_States"){
                    calorias.push(data.dailycalory);
                    anyos.push(data.year);
                    total_label = 'Nº calorias al dia en ' + data.country;
                }
            })
        let anyo = anyos[0];
        res_data2.forEach((data) => {
                if(data.city == "Pekin" && data.year == anyo){
                    medallasOro.push(data.gold_medal);
                    total_label2 = 'Medallas de Oro ganadas ' + data.gold_medal;
                }
            })
        var ctx = document.getElementById('myChart').getContext('2d');
        var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: anyos,
            datasets: [{
                label: total_label,
                data: calorias,
                borderWidth: 1 
            }, {
                label: total_label2,
                data: medallasOro,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
    }
    </script>
    
    <main>
        <h1>Gráfico que muestra el nº de calorias consumidas en un zona determinada y las medallas ganadas por España en 2008</h1>
        <canvas id="myChart" width="400" height="400"></canvas>
    </main>
    
    <svelte:head>
        <script src="https://cdn.jsdelivr.net/npm/chart.js" on:load={loadChart}></script>
    </svelte:head>
<script>
    async function loadData() {
        let res1 = await fetch ('https://sos2021-01.herokuapp.com/api/v2/divorce-stats/');
        await fetch ('https://sos2021-01.herokuapp.com/api/v2/divorce-stats/loadInitialData');
        let res2 = await fetch('https://sos2021-sep-cga.herokuapp.com/api/v2/olimpic-stats?city=Sidney&year=2000')
        
        let res_data1 = await res1.json()
        let res_data2 = await res2.json()
        let divorcios = []
        let olimpics = []
        let medallasOro = [];
        let numDivorcios = [];
        let total_label = [];
        let total_data = [];
        //Meter pais de la api fire
        res_data1.forEach((data) => {
            divorcios.push(data.country+"-"+data.year+"-Ratio de divorcios")
            numDivorcios.push(data.divorce_rate)
        })
        res_data2.forEach((data) => {
            olimpics.push(data.city+"-"+data.year+"-Número de medallas de oro")
            medallasOro.push(data.gold_medal);
        })
        let cont = 0;
        divorcios.forEach((data) =>{
            total_label.push(data)
        })
        olimpics.forEach((data) =>{
            total_label.push(data)
        })
        numDivorcios.forEach((data) =>{
            total_data.push(data)
        })
        console.log(total_data)
        medallasOro.forEach((data) =>{
            total_data.push(data)
        })
        console.log(total_data)
        let c  = {
        type: 'doughnut',
        data: {
            datasets: [
            {
                data: total_data
            },
            ],
            labels: total_label,
        },
        options: {
            title: {
            display: true,
            text: '',
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
    <h1>Gráfico que muestra el nº de incendios en algunos países y el medallasOro de la matrícula según el año</h1>
    <body>
        <img src="" id="graph"/>
    </body>
</main>

<svelte:head>

</svelte:head>
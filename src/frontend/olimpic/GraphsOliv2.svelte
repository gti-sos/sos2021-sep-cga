<script>

    import Header from '../Header.svelte';
    import Button from "sveltestrap/src/Button.svelte";
    import {
        onMount
    } from "svelte";

    async function load_api_graph(){
        let url_api = "/api/v2/olimpic-stats?city=Tokyo&year=2021";
        let res_api = await fetch(url_api)
        let res_data = await res_api.json()
        let medallasOro = []
        let medallasPlata = []
        let years = []
        res_data.forEach((d) =>{
            years.push(d.year)
            medallasOro.push(d.gold_medal)
            medallasPlata.push(d.silver_medal)
        });
        console.log(years)
        console.log(medallasOro)
        console.log(medallasPlata)
        //Propiedades del grafico
        let c = {
            type:'bar',
            data: {labels:years, 
            datasets:[
                {label:'Medallas de Oro',data:medallasOro},
                {label:'Medallas de Plata',data:medallasPlata}
            ]}
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
    load_api_graph()
    </script>
    
    <main>
        <Header/>
        <br>
        <br>
        <Button outline color="secondary" onclick="window.location.href='#/olimpic-stats'">Volver</Button>
        <br>
        <br>
        <h1>Gráfico que muestra las medallas de Tokyo 2021</h1>
        <body>
            <img src="" id="graph"/>
        </body>
    
    </main>
    
    <svelte:head>
    
    </svelte:head>
    
    <style>
    </style>
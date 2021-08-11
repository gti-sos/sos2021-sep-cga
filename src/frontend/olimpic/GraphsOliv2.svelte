<script>

    import Header from '../Header.svelte';
    import Button from "sveltestrap/src/Button.svelte";
    import {
        onMount
    } from "svelte";

    async function load_api_graph(){
        let url_api = "/api/v2/olimpic-stats?city=Barcelona&year=1992";
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
            <div style="margin:auto;"> 
            <figure class="highcharts-figure">
                <div id="container"></div>
                <p class="highcharts-description">
                   Gráfico de barras sobre las medallas de España en los Juegos Olímpicos.
                </p>
            </figure>  
        </main>
        
        
        <style>
            .highcharts-figure {
              min-width: 100%;
              max-width:100%;
              margin: 1em auto;
            }
            #container {
              height: 400px;
            }
            
        </style>
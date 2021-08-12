<script>
  import { select_multiple_value } from "svelte/internal";
  
  
    var miAPI = "https://sos2021-27.herokuapp.com/api/v2/province-budget-and-investment-in-social-promotion?year=2016";
    var API2 = "https://sos2021-sep-cga.herokuapp.com/api/v2/olimpic-stats?city=Rio&year=2016";
    async function loadGraph(){
        let dataG2 = [];
        let myData = [];
               
        const resDataG2 = await fetch(API2);
        const resData = await fetch(miAPI);
  
        myData = await resData.json();
        dataG2 = await resDataG2.json();
  
        let array1 = [];
        let array2 =[];
        let sum = [];
  
        dataG2.forEach(( x) =>{
       sum = x.gold_medal
       console.log(dataG2)
       console.log((x.gold_medal))
       
        });
        
       array1.push({x:"2016".toString(), y:sum })
  
        
  
        
  
    myData.forEach(( x) =>{
       array2.push({x: x.year.toString(), y:x.budget})
       
      });
      console.log(myData)
  
      console.log(array1)
      console.log(array2)
      
  
        console.log("OK, BIEN")
        var chart = JSC.chart('chartDiv', { 
  debug: true, 
  type: 'area', 
  title_label_text: 'Area Series Types', 
  legend_visible: false, 
  defaultSeries: { 
    shape_opacity: 0.7, 
    color: '#f58e5e', 
    defaultPoint_marker: { 
      size: 10, 
      outline: { color: 'white', width: 2 } 
    } 
  }, 
  toolbar_items: { 
    'Area Type': { 
      type: 'select', 
      label_style_fontSize: 13, 
      margin: 5, 
      items: 'Area,Area Step,Area Spline', 
      events_change: function(val) { 
        chart.series().options({ type: val }); 
      } 
    } 
  }, 
  xAxis: { }, 
  series:  [ 
    { 
      name: 'Presupuesto de distintas ciudades de España',
      points: array2
      
    }, 
    { 
      name: 'Medallas de Oro', 
      points: array1
    } 
  ] 
});
  }
  </script>
  
  <svelte:head>
  
  <script
  
  type="text/javascript" src="https://code.jscharting.com/latest/jscharting.js"
      on:load={loadGraph}></script>
  </svelte:head>
  
  <main>
  
  <div id="chartDiv"></div>
  
  </main>
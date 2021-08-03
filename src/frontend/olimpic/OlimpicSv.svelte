<script>
	import {
		onMount
	} from "svelte";
	const placement = 'right';
	import Alert from 'sveltestrap/src/Alert.svelte';
	import Table from "sveltestrap/src/Table.svelte";
	import Button from "sveltestrap/src/Button.svelte";
	import Popover from 'sveltestrap/src/Popover.svelte';
	import { CustomInput, Form, FormGroup, Label } from 'sveltestrap';
	import {Pagination, PaginationItem, PaginationLink } from "sveltestrap";
	let errorMsg = "";
	let okMsg = "";
	let olimpic = [];
	let newOlimpic = {
		city: "",
		year: "",
		gold_medal: "",
		silver_medal: "",
		bronze_medal: "",
		
	};
	let visible = false;
	let visibleOk = false;
	
	let c_offset = 0;
    let offset = 0;
    let limit = 10;
    let c_page = 1;
    let lastPage = 1;
    let total = 0;
	
	const BASE_CONTACT_API_PATH = "/api/v2";
	
	async function OlimpicData() {
    	console.log("Loading data...");
   		const res = await fetch(BASE_CONTACT_API_PATH +"/olimpic-stats/loadInitialData").then( (res)=> {
						getOlimpic();
						okMsg = "Los datos se introdujeron correctamente";
						visibleOk=true;
						visible=false;
						})
		
  	}
	
	async function getOlimpic() {
    	console.log("Fetching data...");
   		const res = await fetch(BASE_CONTACT_API_PATH +"/olimpic-stats"+ "?limit=" + limit + "&offset=" + c_offset);
		
        if(res.ok){
			console.log("Ok.");
			const json = await res.json();
			olimpic = json;
			console.log(`We have ${olimpic.length} olimpic.`);
			paginacion();
		}else{
			console.log("Error");
			
		}
  	}
let filterOlimpic= {
		city:"",
		fromyear:0,
		toyear:0,
		gold_medal: 0,
		silver_medal:0,
		bronze_medal:0
	}
	
	
	async function getFiltro(){
		let dbquery= "?";
		var e = document.getElementById("myselect");
		
		
		if (document.getElementById('filtroCiudad').checked){
            dbquery += `city=${filterOlimpic.city}`;
			if(document.getElementById('filtroAnyoFrom').checked || document.getElementById('filtroAnyoTo').checked || document.getElementById('filtroOro').checked || document.getElementById('filtroPlata').checked || document.getElementById('filtroBronce').checked){
			dbquery +=`&`;
			}
		}
		
		console.log("FROM YEAR  :" + filterOlimpic.fromyear);
		if (document.getElementById('filtroAnyoFrom').checked) {
            dbquery += `fromyear=${filterOlimpic.fromyear}`;
			if(document.getElementById('filtroAnyoTo').checked 
			|| document.getElementById('filtroOro').checked 
			|| document.getElementById('filtroPlata').checked || document.getElementById('filtroBronce').checked ){
				dbquery +=`&`;
			}
			
		}
		
		if (document.getElementById('filtroAnyoTo').checked) {
            dbquery += `toyear=${filterOlimpic.toyear}`;
			if(document.getElementById('filtroOro').checked || document.getElementById('filtroPlata').checked 
			|| document.getElementById('filtroBronce').checked ){
				dbquery +=`&`;
			}
			
		}
		
		if (document.getElementById('filtroOro').checked) {
            dbquery += `gold_medal=${filterOlimpic.gold_medal}`;
			if(document.getElementById('filtroPlata').checked || document.getElementById('filtroBronce').checked){
				dbquery +=`&`;
			}
			
		}
		if (document.getElementById('filtroPlata').checked) {
            dbquery += `silver_medal=${filterOlimpic.silver_medal}`;
			if(document.getElementById('filtroBronce').checked){
				dbquery +=`&`;
			}
			
		}
		if (document.getElementById('filtroBronce').checked) {
            dbquery += `bronze_medal=${filterOlimpic.bronze_medal}`
			
		}
		const res = await fetch("/api/v2/olimpic-stats" + dbquery);
		
		if(res.ok){
			console.log("Ok.");
			const json = await res.json();
			olimpic = json ;
			if(olimpic.length>0){
			okMsg = "Datos filtrados";
			visibleOk=true;
			visible=false;
			console.log(`We have ${olimpic.length} olimpic.`);
			console.log(JSON.stringify(olimpic));
			}else{
			errorMsg = "No se encuentran datos con los filtros seleccionados";
			visibleOk=false;
			visible=true;
			console.log("Error!");
			
		}
		
		}
		
	}
	async function paginacion() {
      const data = await fetch(BASE_CONTACT_API_PATH + "/olimpic-stats");
      if (data.status == 200) {
        const json = await data.json();
        total = json.length;
        cambiapag(c_page, c_offset);
      } 
    }
	
    function range(size, start = 0) {
      return [...Array(size).keys()].map((i) => i + start);
	}
	 
	function cambiapag(page, offset) {
      
      lastPage = Math.ceil(total / 10);
      console.log("Last page = " + lastPage);
      if (page !== c_page) {
        c_offset = offset;
        c_page = page;
        getOlimpic();
      }
    } 
    
	async function insertOlimpic() {
    	console.log("Inserting data "+ JSON.stringify(newOlimpic));
   		
		const res = await fetch(BASE_CONTACT_API_PATH +"/olimpic-stats",
							{
								method: "POST",
								body: JSON.stringify(newOlimpic),
								headers:{
									"Content-Type": "application/json"
								}
							}
		).then((res) => {
			
			if(res.ok){
				getOlimpic();
				okMsg = "El dato se introdujo correctamente";
				visibleOk=true;
				visible=false;
			}else if(res.status === 409){
                errorMsg = "Ya existe ese dato";
				visibleOk=false;
				visible=true;
			}else if(res.status === 400){
				errorMsg = "Campo mal introducido";
				visibleOk=false;
				visible=true;
			}
            
		});
	}	
	
	async function deleteolimpic(city, year) {
    	console.log(`Deleting data with name ${city} and date ${year}`);
   		
		const res = await fetch(BASE_CONTACT_API_PATH +"/olimpic-stats/"+city+"/"+year,
							{
								method: "DELETE"
								
							}).then( function (res) {
								getOlimpic();
								okMsg = "Dato eliminado";
								visibleOk=true;
								visible=false;
							})
	}
	
	async function deleteAll(city, year) {
    	console.log("Deleting all data");
   		
		const res = await fetch(BASE_CONTACT_API_PATH +"/olimpic-stats",{
								method: "DELETE"
								
							}).then( function (res) {
							if(res.ok){
								getOlimpic();
								okMsg = "Todos los datos se han eliminado";
								visibleOk=true;
								visible=false;
							}else{
								errorMsg = "No hay datos que borrar";
								visibleOk=false;
								visible=true;
							}
							})
	}
	
	onMount(getOlimpic);
	
</script>

<main>
	
	<Alert color="danger" isOpen={visible} toggle={() => (visible = false)}>
		{#if errorMsg}
			<p>ERROR: {errorMsg}</p>
   		{/if}
	</Alert>
	<Alert color="success" isOpen={visibleOk} toggle={() => (visibleOk = false)}>
		{#if okMsg}
			<p>Correcto: {okMsg}</p>
   		{/if}
	</Alert>
	
	
	<div class="mt-3" style="position: absolute; right:80px;">
    	<Button id={`btn-${placement}`}>Buscar</Button>
   		<Popover target={`btn-${placement}`} {placement} title={`Filtros disponibles`}>
			<Form>
  				<FormGroup>
   						 
					<CustomInput type="checkbox" id="filtroCiudad" label="Ciudad" ><input bind:value="{filterOlimpic.city}"></CustomInput>
					<CustomInput type="checkbox" id="filtroAnyoFrom" label="Desde el año:" ><input type=number bind:value="{filterOlimpic.fromyear}"></CustomInput>
					<CustomInput type="checkbox" id="filtroAnyoTo" label="Hasta el año:" ><input type=number bind:value="{filterOlimpic.toyear}"></CustomInput>
					<CustomInput type="checkbox" id="filtroOro" label="Medallas de oro" ><input type=number bind:value="{filterOlimpic.gold_medal}"></CustomInput>
					<CustomInput type="checkbox" id="filtroPlata" label="Medallas de plata" ><input type=number bind:value="{filterOlimpic.silver_medal}"></CustomInput>
					<CustomInput type="checkbox" id="filtroBronce" label="Medallas de bronce" ><input type=number bind:value="{filterOlimpic.bronze_medal}"></CustomInput>
					<br>
					<Button on:click={getFiltro}>Filtrar</Button>
					<Button outline color="secondary" on:click="{getOlimpic}">Atrás</Button>
				</FormGroup>
			</Form>
    	</Popover>
  	</div>
	
	
	
	<Table responsive>
	
		<thead>
			<tr>
				<td><Button on:click={OlimpicData}>Cargar datos</Button></td>
				<td><Button on:click={deleteAll}>Borrar datos</Button></td>
					
			</tr>
			
			<tr>
				<th>Ciudad</th>
				<th>Año</th>
				<th>Medallas de oro</th>
				<th>Medallas de plata</th>
				<th>Medallas de bronce</th>
				<th>Acción</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><input bind:value="{newOlimpic.city}"></td>
				<td><input type=number bind:value="{newOlimpic.year}"></td>
				<td><input type=number bind:value="{newOlimpic.gold_medal}"></td>
				<td><input type=number bind:value="{newOlimpic.silver_medal}"></td>
				<td><input type=number bind:value="{newOlimpic.bronze_medal}"></td>
				<td><Button on:click={insertOlimpic}>Insertar</Button></td>
			</tr>
			{#each olimpic as obe}
				<tr>
				<td><a href="#/olimpic-stats/{obe.city}/{obe.year}">{obe.city}</td>
				
				<td>{obe.year}</td>
				<td>{obe.gold_medal}</td>
				<td>{obe.silver_medal}</td>
				<td>{obe.bronze_medal}</td>
				<td><Button on:click={deleteolimpic(obe.city,obe.year)}>Borrar</Button></td>
				
				
				</tr>
			{/each}
			
		</tbody>
		<div>
    		
      		<Pagination ariaLabel="Web pagination">
        		<PaginationItem class = {c_page === 1 ? "enable" : ""}>
          			<PaginationLink previous href="#/olimpic-stats" on:click={() => cambiapag(c_page - 1, c_offset - 10)}/>
        		</PaginationItem>
        		{#each range(lastPage, 1) as page}
          			<PaginationItem class = {c_page === page ? "active" : ""}>
            			<PaginationLink previous href="#/olimpic-stats" on:click={() => cambiapag(page, (page - 1) * 10)}>
            				{page}
            			</PaginationLink>
          			</PaginationItem>
        		{/each}
        		<PaginationItem class = {c_page === lastPage ? "disabled" : ""}>
          			<PaginationLink next href="#/olimpic-stats" on:click={() => cambiapag(c_page + 1, c_offset + 10)}/>
        		</PaginationItem>
      		</Pagination>
    
    	</div>
	</Table>
</main>


<style>
	td	{
		width: 10px;
	}
	tr {
		max-width: 120px;
		overflow: auto;
	}
	input	{
		max-width: 120px;
	}	
	
</style>
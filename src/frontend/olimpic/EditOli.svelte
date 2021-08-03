<script>
    import {
        onMount
    } from "svelte";
    import {
        pop
    } from "svelte-spa-router";
	import Alert from "sveltestrap/src/Alert.svelte";
    import Table from "sveltestrap/src/Table.svelte";
    import Button from "sveltestrap/src/Button.svelte";
	
	const colors= [
   	 	'primary',
   		'secondary',
   		 'success',
   		 'danger',
   		 'warning',
   		 'info',
   		 'light',
   		 'dark'
 	];
	
	const BASE_CONTACT_API_PATH = "/api/v2";
    export let params = {};
    let olimpic = {};
	let upcity = "XXXX";
	let upYear = 12345;
	let upgold_medal = 123;
	let upsilver_medal = 123;
	let upbronze_medal = 12345;
    let errorMsg = "";
 	let okMsg = "";
	let visible = false;
	let visibleOk = false;
    onMount(getOlimpic);
    async function getOlimpic() {
        console.log("Fetching data..." + params.city + " " + params.year);
        const res = await fetch(BASE_CONTACT_API_PATH +"/olimpic-stats/" + params.city +"/" + params.year);
        if (res.ok) {
            console.log("Ok:");
            const json = await res.json();
            olimpic = json;
			
			upcity = olimpic.city;
	 		upYear = parseInt(olimpic.year);
			upgold_medal = parseInt(olimpic.gold_medal);
	 		upsilver_medal = parseInt(olimpic.silver_medal);
	 		upbronze_medal = parseInt(olimpic.bronze_medal);
			
			console.log(JSON.stringify(olimpic));
            console.log("Received data.");
        } else {
			if(res.status === 404){
            	errorMsg = `No existe dato con Ciudad: ${params.city} y fecha: ${params.year}`;
            	console.log("ERROR!" + errorMsg);
				visibleOk=false;
				visible=true;
			} else if (res.status === 500) {
        		errorMsg = "No se han podido acceder a la base de datos";
      		}
			
      		console.log("ERROR!" + errorMsg);
        }
    }
    async function updateOlimpic() {
        console.log("Updating data..." + JSON.stringify(params.city) + ", " + JSON.stringify(params.year));
		let year = parseInt(params.year);
		
		
        const res = await fetch(BASE_CONTACT_API_PATH +"/olimpic-stats/" + params.city +"/" + params.year, {
            method: "PUT",
            body: JSON.stringify({
               	city: params.city,
          		year: year,
          		gold_medal: parseInt(upgold_medal),
          		silver_medal: parseInt(upsilver_medal),
          		bronze_medal: parseInt(upbronze_medal),
            }),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (res) {
			if(res.ok){
				console.log("Ok.");
				getOlimpic();
				okMsg = "Actualización correcta";
				visibleOk=true;
				visible=false;
				
			}else{
				if(res.status === 404){
					errorMsg ="El dato solicitado no existe";
					visibleOk=false;
					visible=true;
				}
			}
			
			getOlimpic();
			console.log("ERROR!" + errorMsg);
            
        });
    }
	
	
</script>
<main>
    <h3>Editar campos <strong>{params.city}</strong><strong>{params.year}</strong></h3>
        <Table bordered>
            <thead>
				<div>
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
				</div>
			
			
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
                    <td>{upcity}</td>
					<td>{upYear}</td>
                    <td><input type=number bind:value="{upgold_medal}"></td>
					<td><input type=number bind:value="{upsilver_medal}"></td>
					<td><input type=number bind:value="{upbronze_medal}"></td>
					<td><Button on:click={updateOlimpic}>Actualizar</Button></td>
                    
                </tr>
        	</tbody>
        </Table>
		
		
		<Button outline color="secondary" on:click="{pop}">Volver</Button>
		
</main>

<style>
  main{
    text-align: center;
    padding: 1em;
    margin: 0 auto;
  }
</style>
<script>
	import Header from '../Header.svelte';
	import OlimpicSv from './OlimpicSv.svelte';
	import {
		Button,
		Modal,
		ModalBody,
		ModalFooter,
		ModalHeader,
		Breadcrumb,
		BreadcrumbItem,
	} from 'sveltestrap';
	
	let openob = false;
	
	const toggleob = () =>{
		(openob = !openob);
	}  
</script>

<main>
	<Header/>
	
	<h2>
		<strong>API</strong>
	</h2>
	<Breadcrumb>
  				<BreadcrumbItem><a href="https://sos2021-sep-cga.herokuapp.com/api/v1/olimpic-stats">Estadísticas de medallas V1</a></BreadcrumbItem>
				<BreadcrumbItem active>Desarrollado por Carlos González Arenas</BreadcrumbItem>
	</Breadcrumb>
	<Breadcrumb>
                <BreadcrumbItem><a href="https://sos2021-sep-cga.herokuapp.com/api/v2/olimpic-stats">Estadísticas de medallas V2</a></BreadcrumbItem>
                <BreadcrumbItem active>Desarrollado por Carlos González Arenas</BreadcrumbItem>
	</Breadcrumb>
			
	<h2>
		<strong>Front-end Svelte:</strong>
	</h2>
	<h5>Estadísticas de medallas:</h5>
	
		<Button id="open" outline color="warning" on:click={toggleob}>Abrir</Button>
		<Modal isOpen={openob} {toggleob} size= 'xl'>
			<ModalHeader {toggleob}>Estadísticas de medallas</ModalHeader>
			<ModalBody>
				<OlimpicSv/>
			</ModalBody>
			<ModalFooter>
				<Button color="secondary" on:click={toggleob}>Cerrar</Button>
			</ModalFooter>
		</Modal>
			
	<h5>Gráfica de las medallas de España:</h5>
			
	<Button id='hc' outline color="warning" onclick="window.location.href='#/olimpic-stats/graphs'">Gráfico Highcharts</Button>
	<Button id='qc' outline color="warning" onclick="window.location.href='#/olimpic-stats/graphsv2'">Gráfico Quickchart</Button>
				
	<h2>
		<strong>Documentación en Postman:</strong>
	</h2>
	
	<Breadcrumb class="peque">
		<BreadcrumbItem active>Estadísticas de medallas </BreadcrumbItem>
  		<BreadcrumbItem><a href="https://documenter.getpostman.com/view/12390654/TzseKmsN">V1</a></BreadcrumbItem>
	</Breadcrumb>
	<Breadcrumb>
		<BreadcrumbItem active>Estadísticas de medallas</BreadcrumbItem>
		<BreadcrumbItem><a href="https://documenter.getpostman.com/view/12390654/Tzz8sHNK">V2</a></BreadcrumbItem>
	  </Breadcrumb>
	
	

</main>

<style>
	main {
		text-align: left;
		padding: 2.5em;
		
		margin: 0 auto;
	}
</style>
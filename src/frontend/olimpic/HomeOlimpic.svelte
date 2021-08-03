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
  				<BreadcrumbItem><a href="https://sos2021-sep-cga.herokuapp.com/api/v1/olimpic-stats">Estadísticas de medallas</a></BreadcrumbItem>
				<BreadcrumbItem active>Desarrollado por Almudena González López de Letona</BreadcrumbItem>
	</Breadcrumb>
	<Breadcrumb>
                <BreadcrumbItem><a href="https://sos2021-sep-cga.herokuapp.com/api/v2/olimpic-stats">Estadísticas de medallas</a></BreadcrumbItem>
                <BreadcrumbItem active>Desarrollado por Almudena González López de Letona</BreadcrumbItem>
	</Breadcrumb>
			
	<h2>
		<strong>Front-end Svelte:</strong>
	</h2>
	<h5>Estadísticas de medallas:</h5>
	
		<Button outline color="warning" on:click={toggleob}>Abrir</Button>
		<Modal isOpen={openob} {toggleob} size= 'xl'>
			<ModalHeader {toggleob}>Estadísticas de medallas</ModalHeader>
			<ModalBody>
				<OlimpicSv/>
			</ModalBody>
			<ModalFooter>
				<Button color="secondary" on:click={toggleob}>Cerrar</Button>
			</ModalFooter>
		</Modal>
			
			
	<h2>
		<strong>Documentación en Postman:</strong>
	</h2>
	
	<Breadcrumb class="peque">
		<BreadcrumbItem active>Estadísticas de medallas </BreadcrumbItem>
  		<BreadcrumbItem><a href="https://documenter.getpostman.com/view/12390654/TzseKmsN">Medal_Postman</a></BreadcrumbItem>
	</Breadcrumb>
	
	

</main>

<style>
	main {
		text-align: left;
		padding: 2.5em;
		
		margin: 0 auto;
	}
</style>
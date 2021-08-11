<script>
	import Header from './Header.svelte';
	import {
			Button,
			Modal,
			ModalBody,
			ModalFooter,
			ModalHeader,
			Breadcrumb,
			BreadcrumbItem,
			Collapse,
			Navbar,
			NavbarToggler,
			NavbarBrand,
			Nav,
			NavItem,
			NavLink
		} from 'sveltestrap';
		
	let open = false;
    let opensa = false;
    let openob = false;
    const toggle = () =>{
  	
		(open = !open);
	  }  
	  const togglesa = () =>{
		(opensa = !opensa);
	  } 
	  const toggleob = () =>{
		(openob = !openob);
  } 
  
  
</script>


<main>
	<Header/>




	<div class="position">
	<h1>
		<strong>sos2021-sep-cga</strong>
	</h1>
	<h2>
		Integrante:
	</h2>
	<ul>
		<Breadcrumb class="peque">
  			<BreadcrumbItem active>Carlos González Arenas</BreadcrumbItem>
			<BreadcrumbItem active><a href="https://github.com/cargonare1">Enlace a Github</a></BreadcrumbItem>
		</Breadcrumb>
		
			
	</ul>
	<h2>
		Descripción del proyecto:
	</h2>
	<p>
		Queremos analizar el número de medallas cosechadas por España en los distintos Juegos Olímipicos
	</p>
	<p>
		<strong>Repositorio: </strong> <a href="https://github.com/gti-sos/sos2021-sep-cga">https://github.com/gti-sos/sos2021-sep-cga</a> 
	</p>
	<p>
		<strong>URL: </strong><a href="https://sos2021-sep-cga.herokuapp.com/">https://sos2021-sep-cga.herokuapp.com/</a> 
	</p>

	<Button  color="secondary" onclick="window.location.href='#/integrations'">Integraciones</Button>
	<h2>
		APIs desarrolladas:
	</h2>
	<ul>
		<Breadcrumb>
			<BreadcrumbItem><a href="https://sos2021-sep-cga.herokuapp.com/api/v1/olimpic-stats">Estadísticas de medallas V1</a></BreadcrumbItem>
		  	<BreadcrumbItem active>Desarrollado por Carlos González Arenas</BreadcrumbItem>
		</Breadcrumb>
		<Breadcrumb>
		  <BreadcrumbItem><a href="https://sos2021-sep-cga.herokuapp.com/api/v2/olimpic-stats">Estadísticas de medallas V2</a></BreadcrumbItem>
		  <BreadcrumbItem active>Desarrollado por Carlos González Arenas</BreadcrumbItem>
		</Breadcrumb>
			
	</ul>
	
	<h2>
		Documentación en Postman:
	</h2>
	<ul>
		<Breadcrumb class="peque">
  			<BreadcrumbItem active>Estadísticas de medallas</BreadcrumbItem>
  			<BreadcrumbItem><a href="https://documenter.getpostman.com/view/12390654/TzseKmsN">V1</a></BreadcrumbItem>
			
		</Breadcrumb>
			
	</ul>

</main>

<style>
	.position {
		padding-top: 1cm;
		text-align: center;
		margin: 0 auto;
	}
	h1 {
		font-family: Lucida Console;
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}
</style>
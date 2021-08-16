<script>
	import Header from '../Header.svelte';
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
	
  
  
</script>


<main>
	<Header/>

	<div class="position">
	<h1>
		<strong>sos2021-sep-cga</strong>
	</h1>

	<h2>
		Intregraciones:
	</h2>
	<ul>
		<Button  class="secondary" onclick="window.location.href='#/olimpic-stats/smoke-stats'" >I01-Smoke Stats</Button>
		<Button  class="secondary" onclick="window.location.href='/#/olimpic-stats/sanity-stats'"> I02-Sanity Stats</Button>
		<Button class="secondary" onclick="window.location.href='/#/olimpic-stats/budget-stats'"> I03-Budget Stats</Button>
		<Button class="secondary" onclick="window.location.href='/#/olimpic-stats/block-chain'"> I04-Block Chain</Button>
		<Button  class="secondary" onclick="window.location.href='/#/olimpic-stats/pokemon'"> I05-Pokemon</Button>
		<Button class="secondary" onclick="window.location.href='/#/olimpic-stats/food'"> I06-Food</Button>
		<Button class="secondary" onclick="window.location.href='/#/olimpic-stats/co2'"> I07-CO2 </Button>
		<Button class="secondary" onclick="window.location.href='/#/olimpic-stats/covid-india'"> I08-</Button>
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
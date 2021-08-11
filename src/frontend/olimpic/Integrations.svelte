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
		<Button  class="secondary" onclick="window.location.href='#/olimpic-stats/foodconsumption-stats'" >G01-Divorce stats</Button>
		<!--<Button  class="secondary" onclick="window.location.href='/#/foodconsumption-stats/nuts-production'"> G02-Nuts Production</Button>
		<Button class="secondary" onclick="window.location.href='/#/foodconsumption-stats/wine-production-stats'"> G02-Wine Production</Button>
		<Button class="secondary" onclick="window.location.href='/#/foodconsumption-stats/international-tourism'"> G03-International tourism</Button>
		<Button  class="secondary" onclick="window.location.href='/#/foodconsumption-stats/poverty-risks'"> G04-Poverty risks</Button>
		<Button class="secondary" onclick="window.location.href='/#/foodconsumption-stats/children-out-school'"> G24-Children out of school</Button>
		<Button class="secondary" onclick="window.location.href='/#/foodconsumption-stats/apiext1'"> API Externa 1</Button>
		<Button class="secondary" onclick="window.location.href='/#/foodconsumption-stats/apiext2'"> API Externa 2</Button>-->
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
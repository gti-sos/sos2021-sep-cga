<script>
	import Router from 'svelte-spa-router';
	import NotFound from './NotFound.svelte';

	import Info from './Info.svelte';
	import Landing from './Landing.svelte';
	import HomeOlimpic from './olimpic/HomeOlimpic.svelte';
	import EditOli from './olimpic/EditOli.svelte';
	import GraphsOli from './olimpic/GraphsOli.svelte';
	import GraphsOliv2 from './olimpic/GraphsOliv2.svelte';
	import Integrations from './olimpic/Integrations.svelte';
	import IntegrationSmoke from './olimpic/IntegrationSmoke.svelte';
	import IntegrationSanity from "./olimpic/IntegrationSanity.svelte";
	import IntegrationsBudget from './olimpic/IntegrationsBudget.svelte';
	import IntegrationBlockChain from './olimpic/IntegrationBlockChain.svelte';
	import IntegrationPokemon from './olimpic/IntegrationPokemon.svelte';
	import IntegrationFood from './olimpic/IntegrationFood.svelte';
	import IntegrationCO2 from './olimpic/IntegrationCO2.svelte';
	import IntegrationRental from './olimpic/IntegrationRental.svelte';
	
	
	const routes = {
		"/": Landing,
		"/info": Info,
		"/olimpic-stats": HomeOlimpic,
		"/olimpic-stats/:city/:year": EditOli,
		"/olimpic-stats/graphs": GraphsOli,
		"/olimpic-stats/graphsv2": GraphsOliv2,
		"/integrations": Integrations,
		"/olimpic-stats/smoke-stats": IntegrationSmoke,
		"/olimpic-stats/sanity-stats": IntegrationSanity,
		"/olimpic-stats/budget-stats": IntegrationsBudget,
		"/olimpic-stats/block-chain": IntegrationBlockChain,
		"/olimpic-stats/pokemon": IntegrationPokemon,
		"/olimpic-stats/food":IntegrationFood,
		"/olimpic-stats/co2":IntegrationCO2,
		"/olimpic-stats/rental": IntegrationRental,
		"*": NotFound
	}
	
 
  
</script>
<main>
	
	<Router {routes}/>
</main>

<style>
	main {
		text-align: left;
		padding: 2.5em;
		max-width: 240px;
		margin: 0 auto;
	}
	
	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>
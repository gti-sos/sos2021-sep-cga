<script>
	import Router from 'svelte-spa-router';
	import NotFound from './NotFound.svelte';

	import Info from './Info.svelte';
	import Landing from './Landing.svelte';
	import HomeOlimpic from './olimpic/HomeOlimpic.svelte';
	import EditOli from './olimpic/EditOli.svelte';
	import GraphsInterfaz from './olimpic/GraphsOli.svelte';
	import GraphsOliv2 from './olimpic/GraphsOliv2.svelte';
	
	
	const routes = {
		"/": Landing,
		"/info": Info,
		"/olimpic-stats": HomeOlimpic,
		"/olimpic-stats/:city/:year": EditOli,
		"/graphs": GraphsInterfaz,
		"/olimpic-stats/graphs": GraphsOli,
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
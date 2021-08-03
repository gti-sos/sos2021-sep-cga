<script>
	import Header from './Header.svelte';
</script>

	<main>
		
		<Header/>
		
			<div class="row d-flex justify-content-center text-center">

				<div class="col-md-10">

					<!-- Heading -->
					<h2 class="display-4 font-weight-bold white-text pt-5 mb-2" style="color: white;">sos2021-sep-cga</h2>

					<!-- Divider -->
					<hr class="hr-light">

					<!-- Description -->
					<div style="background-color:white; border-radius:5px; max-width:180px; max-height: 50px; margin: auto;">
						<h4><a href="#/info">Informacion</a></h4>
					</div>

				</div>

			</div>
	
	</main>

<style>
	main	{
		padding-top: 15em;
		/* background: url("https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Olympic_flag.svg/1200px-Olympic_flag.svg.png")no-repeat center center fixed; */
		-webkit-background-size: cover;
		-moz-background-size: cover;
		-o-background-size: cover;
		background-size: cover;
		height: 100%;
	}
</style>
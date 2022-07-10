<script>
	import Graph from "./components/Graph.svelte";


	async function fetchMay() {
		const response = await fetch("https://sa-sheets2json.herokuapp.com/api?id=1HIKtlEkxsT_zRaQfAkJbkWTI8_5fvaFnSwy8-4w0yBY&sheet=mai&rows=false");
		const dates = await response.json();
		if (response.ok) {
			let data = dates.columns.datetime.join('\r\n');
			return data;
		} else {
			throw new Error("Could not fetch data");
		}
	}
	const mayPromise = fetchMay();

  async function fetchJune() {
		const response = await fetch("https://sa-sheets2json.herokuapp.com/api?id=1HIKtlEkxsT_zRaQfAkJbkWTI8_5fvaFnSwy8-4w0yBY&sheet=juni&rows=false");
		const dates = await response.json();
		if (response.ok) {
			let data = dates.columns.datetime.join('\r\n');
			return data;
		} else {
			throw new Error("Could not fetch data");
		}
	}
	const junePromise = fetchJune();

  async function fetchJuly() {
		const response = await fetch("https://sa-sheets2json.herokuapp.com/api?id=1HIKtlEkxsT_zRaQfAkJbkWTI8_5fvaFnSwy8-4w0yBY&sheet=juli&rows=false");
		const dates = await response.json();
		if (response.ok) {
			let data = dates.columns.datetime.join('\r\n');
			return data;
		} else {
			throw new Error("Could not fetch data");
		}
	}
	const julyPromise = fetchJuly();
</script>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Kaushan+Script&display=swap');

	main {
		font-family: Arial, Helvetica, sans-serif;
		padding-top: .5rem;
    color: #3a3a3a;
    text-align: center;
	}
  header {
    display: flex;
    align-items: center;
    flex-direction: column;
  }
  .image {
    max-width: 200px;
  }
  .image img {
    width: 100%;
  }
  .heading {
    display: flex;
    align-items: center;
    padding: 0 1rem;
		justify-content: center;
		padding: .25rem;
		font-family: "Kaushan Script";
		font-size: 2rem;
  }
  .text {
    text-align: center;
    margin-bottom: 2rem;
    font-size: .9rem;
  }
	.graph {
		width: 100%;
		min-height: 100%;
		height: 600px;
		overflow-x: scroll;
    overflow-y: hidden;
	}
  .loading {
    display: flex;
    justify-content: center;
    font-size: .9rem;
  }
</style>
<main>
  <header>
    <div class="image">
      <img src="marten.jpg" alt="">
    </div>
    <div class="heading">
      Mår på viltkamera
    </div>
    <div class="text">
      Hver prikk representerer et videklipp og klokkeslett hvor måren er registrert på viltkamera.
    </div>
  </header>

  <h2>Juli</h2>
  <div class="graph">
		{#await julyPromise}
			<div class="loading">
        Laster...
      </div>
			{:then data}
      <Graph {data}></Graph>
		{/await}
	</div>

	<h2>Juni</h2>
  <div class="graph">
		{#await junePromise}
			<div class="loading">
        Laster...
      </div>
			{:then data}
      <Graph {data}></Graph>
		{/await}
	</div>

  <h2>Mai</h2>
  <div class="graph">  
		{#await mayPromise}
			<div class="loading">
        Laster...
      </div>
			{:then data}
      <Graph {data}></Graph>
		{/await}
	</div>
	
</main>
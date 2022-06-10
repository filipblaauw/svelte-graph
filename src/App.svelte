<script>
	import Graph from "./components/Graph.svelte";


	async function fetchData() {
		const response = await fetch("https://sa-sheets2json.herokuapp.com/api?id=1HIKtlEkxsT_zRaQfAkJbkWTI8_5fvaFnSwy8-4w0yBY&sheet=output&rows=false");
		const dates = await response.json();
		if (response.ok) {
			let data = dates.columns.dato.join('\r\n');
			return data;
		} else {
			throw new Error("data");
		}
	}

	const datapromise = fetchData();
</script>

<style>
	/*
		The wrapper div needs to have an explicit width and height in CSS.
		It can also be a flexbox child or CSS grid element.
		The point being it needs dimensions since the <LayerCake> element will
		expand to fill it.
	*/
	@import url('https://fonts.googleapis.com/css2?family=Kaushan+Script&display=swap');

	main {
		font-family: Arial, Helvetica, sans-serif;
		padding-top: .5rem;
    color: #3a3a3a;
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
	<div class="graph">
		{#await datapromise}
			<div class="loading">
        Laster...
      </div>
			{:then data}
      <Graph {data}></Graph>
		{/await}
	</div>
	
</main>
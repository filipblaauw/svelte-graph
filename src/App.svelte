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
		padding-top: 1rem;
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
		padding: 1rem;
		font-family: "Kaushan Script";
		font-size: 2rem;
  }
	.graph {
		width: 100%;
		min-height: 600px;
		height: 600px;
		overflow-x: scroll;
    padding-bottom: 4rem;
	}
</style>
<main>
  <header>
    <div class="image">
      <img src="https://media.istockphoto.com/vectors/vector-european-pine-marten-illustration-vector-id1253758855?b=1&k=20&m=1253758855&s=170667a&w=0&h=Rn1EP-cYJ1cLSPbwaB3m-VwzLbDgpGzATYRMaP-inIQ=" alt="">
    </div>
    <div class="heading">
      Mår på viltkamera
    </div>
    <div class="text">
      Hver prikk representerer et videklipp fra viltkamera hvor måren er oppdaget.
    </div>
  </header>
	<div class="graph">
		{#await datapromise}
			laster..
			{:then data}
			<Graph {data}></Graph>
		{/await}
	</div>
	
</main>
<script>
	import { LayerCake, ScaledSvg, Html, calcExtents } from 'layercake';
	import { timeDay } from 'd3-time';
	import { scaleBand, scaleTime } from 'd3-scale';
  import { onMount } from "svelte";

	import AxisX from './AxisX-html.svelte';
	import AxisY from './AxisY-html.svelte';
	import Scatter from './Scatter-html.svelte';

	import data from './days.js';
  //let data;


  async function fetchData() {
    const response = await fetch("https://sa-sheets2json.herokuapp.com/api?id=1HIKtlEkxsT_zRaQfAkJbkWTI8_5fvaFnSwy8-4w0yBY&sheet=output&rows=false");
    const dates = await response.json();
    if (response.ok) {
      let finalString  = dates.columns.dato.join('\r\n');
      let data = finalString;
      return data;
    } else {
      throw new Error(data);
    }
  }

  onMount(async () => {
		let data = await fetchData();
    console.log(data);
	});
    
	const xKey = 'seconds';
	const yKey = 'day';

	const r = 4;
	const padding = 2;

  

	const daysTransformed = data.split('\n').map(d => {
		const obj = {};
		const parts = d.split('T');
		const time = parts[1].replace('Z', '').split(':').map(q => +q);
		obj[xKey] = time[0] * 60 * 60 + time[1] * 60 + time[2];
		obj[yKey] = parts[0];
		obj.timestring = d
		return obj;
	});


	/* --------------------------------------------
	 * Generate a range of days in between the min and max
	 * in case we are missing any in our data so we can show empty days for them
	 */
	const extents = calcExtents(daysTransformed, {
		x: d => d.timestring
	});

	// Convert to string even though it is one to make Typescript happy
	const minDate = extents.x[0].toString().split('T')[0].split('-').map(d => +d);
	const maxDate = extents.x[1].toString().split('T')[0].split('-').map(d => +d);

	const allDays = timeDay.range(new Date(Date.UTC(minDate[0], minDate[1] - 1, minDate[2])), new Date(Date.UTC(maxDate[0], maxDate[1] - 1, maxDate[2] + 1)))
		.map(d => d.toISOString().split('T')[0]).sort().reverse();

</script>

<style>
	/*
		The wrapper div needs to have an explicit width and height in CSS.
		It can also be a flexbox child or CSS grid element.
		The point being it needs dimensions since the <LayerCake> element will
		expand to fill it.
	*/
  main {
    font-family: Arial, Helvetica, sans-serif;
  }
  header {
    display: flex;
    justify-content: center;
    font-weight: bold;
    font-size: 2rem;
    
  }
  .image {
    max-width: 150px;
  }
  .image img {
    width: 100%;
  }
  .heading {
    display: flex;
    align-items: center;
    padding: 0 1rem;
  }
	.chart-container {
		width: 100%;
		height: 600px;
    font-family: Arial, Helvetica, sans-serif;
	}
</style>
<main>
  <header>
    <div class="image">
      <img src="https://media.istockphoto.com/vectors/vector-european-pine-marten-illustration-vector-id1253758855?b=1&k=20&m=1253758855&s=170667a&w=0&h=Rn1EP-cYJ1cLSPbwaB3m-VwzLbDgpGzATYRMaP-inIQ=" alt="">
    </div>
    <div class="heading">
      ...
    </div>
  </header>
</main>



<div class="chart-container">

	<LayerCake
		ssr={true}
		percentRange={true}
		padding={{ top: 0, right: 15, bottom: 20, left: 75 }}
		x={xKey}
		y={yKey}
		xDomain={[0, 24 * 60 * 60]}
		yDomain={allDays}
		xScale={scaleTime()}
		yScale={scaleBand().paddingInner([0.05]).round(true)}
		xPadding={[padding, padding]}
		data={daysTransformed}
	>
		<Html>
			<AxisX
				ticks={[0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24].map(d => d * 60 * 60)}
				formatTick={d => `${Math.floor(d / 60 / 60)}:00`}
			/>
			<AxisY/>
			<Scatter
				{r}
				fill={'rgba(255, 204, 0, 0.75)'}
				strokeWidth={0}
			/>
		</Html>
	</LayerCake>

</div>
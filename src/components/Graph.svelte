<script>
  import { LayerCake, ScaledSvg, Html, calcExtents } from "layercake";
  import { timeDay } from "d3-time";
  import { scaleBand, scaleTime } from "d3-scale";

  import AxisX from "./AxisX-html.svelte";
  import AxisY from "./AxisY-html.svelte";
  import Scatter from "./Scatter-html.svelte";

  export let data;

  const xKey = "seconds";
  const yKey = "day";
  const padding = 1;

  const daysTransformed = data.split("\n").map((d) => {
    const obj = {};
    const parts = d.split(" ");
    const time = parts[1].split(":").map((q) => +q);

    obj[xKey] = time[0] * 60 * 60 + time[1] * 60 + time[2];
    obj[yKey] = parts[0];
    obj.timestring = d;
    return obj;
  });

  /* --------------------------------------------
   * Generate a range of days in between the min and max
   * in case we are missing any in our data so we can show empty days for them
   */
  const extents = calcExtents(daysTransformed, {
    x: (d) => d.timestring,
  });

  // Convert to string even though it is one to make Typescript happy
  const minDate = extents.x[0]
    .toString()
    .split(" ")[0]
    .split("-")
    .map((d) => +d);
  const maxDate = extents.x[1]
    .toString()
    .split(" ")[0]
    .split("-")
    .map((d) => +d);

  const allDays = timeDay
    .range(
      new Date(Date.UTC(minDate[0], minDate[1] - 1, minDate[2])),
      new Date(Date.UTC(maxDate[0], maxDate[1] - 1, maxDate[2] + 1))
    )
    .map((d) => d.toISOString().split("T")[0])
    .sort();
</script>

<div class="chart-container">
  <LayerCake
    ssr={true}
    percentRange={true}
    padding={{ top: 30, right: 15, bottom: 10, left: 30 }}
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
        ticks={[
          0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
          20, 21, 22, 23, 24,
        ].map((d) => d * 60 * 60)}
        formatTick={(d) => `${Math.floor(d / 60 / 60)}`}
      />
      <AxisY />
      <Scatter />
    </Html>
  </LayerCake>
</div>

<style>
  .chart-container {
    min-width: 600px;
    width: 100%;
    height: 100%;
    font-family: Arial, Helvetica, sans-serif;
  }
</style>

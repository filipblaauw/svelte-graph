<script>
  import Graph from "./components/Graph.svelte";
  import { onMount } from "svelte";

  let months = [
    "mai_2023",
    "april_2023",
    "august_2022",
    "juli_2022",
    "juni_2022",
    "mai_2022",
  ];
  let monthData = {};

  async function fetchDataForMonth(month) {
    const response = await fetch(
      `https://sa-sheets2json.herokuapp.com/api?id=1HIKtlEkxsT_zRaQfAkJbkWTI8_5fvaFnSwy8-4w0yBY&sheet=${month}&rows=false`
    );
    const dates = await response.json();
    if (response.ok) {
      if (dates.columns && dates.columns.datetime) {
        return dates.columns.datetime.join("\r\n");
      } else {
        return "";
      }
    } else {
      throw new Error("Could not fetch data");
    }
  }

  function findHoursWithMostEvents(events) {
    const timestamps = events.split("\r\n").map((event) => new Date(event));
    const hourlyCounts = {};

    for (const timestamp of timestamps) {
      const hour = timestamp.getHours();

      if (!hourlyCounts[hour]) {
        hourlyCounts[hour] = 0;
      }
      hourlyCounts[hour]++;
    }

    const sortedHours = Object.keys(hourlyCounts).sort(
      (a, b) => hourlyCounts[b] - hourlyCounts[a]
    );

    const topThreeHours = sortedHours.slice(0, 3);

    const hourRanges = topThreeHours.map((hour) => {
      const startHour = hour.toString().padStart(2, "0");
      const endHour = (parseInt(hour) + 1).toString().padStart(2, "0");
      return `${startHour}-${endHour}`;
    });

    const results = hourRanges.map((range) => {
      const count = hourlyCounts[parseInt(range.substring(0, 2))] || 0;
      return `${range} (${count})`;
    });

    return results;
  }

  function formatMonth(month) {
    const parts = month.split("_");
    const year = parts[1];
    const monthName = parts[0];
    return `${monthName} ${year}`;
  }

  onMount(async () => {
    try {
      for (let month of months) {
        monthData[month] = await fetchDataForMonth(month);
      }
    } catch (error) {
      console.error(error);
    }
  });
</script>

<main>
  <header>
    <div class="image">
      <img src="marten.jpg" alt="" />
    </div>
    <div class="heading">Mår på viltkamera</div>
  </header>

  {#each months as month}
    <div class="month">
      <h2>{formatMonth(month)}</h2>
      {#if monthData[month]}
        {#await monthData[month] then data}
          {#if month in monthData}
            <p class="text"><b>Timer med flest triggere:</b></p>
            {#each findHoursWithMostEvents(data) as hour}
              <span>kl {hour}</span>
            {/each}
          {/if}
        {/await}
      {/if}
      <div class="graph">
        {#if monthData[month]}
          {#await monthData[month]}
            <div class="loading">Loading...</div>
          {:then data}
            {#if month in monthData}
              {#if data.length > 0}
                <Graph {data} />
              {:else}
                <p>No data available</p>
              {/if}
            {/if}
          {/await}
        {/if}
      </div>
    </div>
  {/each}
</main>

<style>
  @import url("https://fonts.googleapis.com/css2?family=Kaushan+Script&display=swap");

  main {
    font-family: -apple-system, -apple-system, BlinkMacSystemFont, "Segoe UI",
      Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue",
      sans-serif;
    padding-top: 0.5rem;
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
    padding: 0.25rem;
    font-family: "Kaushan Script";
    font-size: 2rem;
  }
  .text {
    text-align: left;
    margin: 0;
    font-size: 0.9rem;
    margin-bottom: 0.25em;
  }
  span {
    font-size: 0.8rem;
    background-color: #f2f2f2;
    padding: 0.2em 0.5em;
    margin-right: 0.5em;
    border-radius: 0.25em;
    font-weight: 600;
    color: #555;
  }
  .month {
    padding: 1em 0;
    border-bottom: 1px solid #bebebe;
  }
  .graph {
    width: 100%;
    min-height: 100%;
    height: 600px;
    overflow-y: hidden;
  }
  h2 {
    margin: 0.25em 0;
    font-size: 1.2em;
    font-weight: 800;
    text-transform: uppercase;
  }
  .loading {
    display: flex;
    justify-content: center;
    font-size: 0.9rem;
  }
</style>

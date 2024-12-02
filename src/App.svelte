<script>
  import Graph from "./components/Graph.svelte";
  import { onMount } from "svelte";

  let selectedAnimal = "eagle";
  let norskNavn = "Ørn";

  function handleAnimalSelection(animal) {
    selectedAnimal = animal;
    if(selectedAnimal === 'eagle') {
      norskNavn = "Ørn"
    }
    if(selectedAnimal === 'marten') {
      norskNavn = "Mår"
    }
    if(selectedAnimal === 'fox') {
      norskNavn = "Rev"
    }
  }

  let months = [
    "eagle_desember_2024",
    "eagle_november_2024",
    "marten_april_2024",
    "marten_mars_2024",
    "marten_februar_2024",
    "marten_januar_2024",
    "fox_august_2023",
    "marten_august_2023",
    "fox_juli_2023",
    "marten_juli_2023",
    "fox_juni_2023",
    "marten_juni_2023",
    "fox_mai_2023",
    "fox_april_2023",
    "marten_mai_2023",
    "marten_april_2023",
    "marten_august_2022",
    "marten_juli_2022",
    "marten_juni_2022",
    "marten_mai_2022",
  ];
  let monthData = {};

  async function fetchDataForMonth(month) {
    const cachedData = localStorage.getItem(`data_${month}`);
    if (cachedData) {
      const parsedData = JSON.parse(cachedData);
      const cachedTime = parsedData.timestamp;
      const currentTime = new Date().getTime();
      const twelveHours = 12 * 60 * 60 * 1000;

      if (currentTime - cachedTime < twelveHours) {
        console.log(`Serving cached data for ${month}`);
        return parsedData.data;
      }
    }

    const response = await fetch(
      `https://sa-sheets2json.herokuapp.com/api?id=1HIKtlEkxsT_zRaQfAkJbkWTI8_5fvaFnSwy8-4w0yBY&sheet=${month}&rows=false`
    );
    const dates = await response.json();
    if (response.ok) {
      if (dates.columns && dates.columns.datetime) {
        const animalPrefix = month.split("_")[0];
        const result = {
          prefix: animalPrefix,
          data: dates.columns.datetime.join("\r\n"),
        };
        const cacheData = {
          timestamp: new Date().getTime(),
          data: result,
        };
        localStorage.setItem(`data_${month}`, JSON.stringify(cacheData));
        return result;
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
    const year = parts[2];
    const monthName = parts[1];
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

<header>
  <div class={`cover ${selectedAnimal}`}>
    <div class="heading">
      {#if selectedAnimal === "eagle"}
        Ørn på viltkamera
      {:else if selectedAnimal === "marten"}
        Mår på viltkamera
      {:else if selectedAnimal === "fox"}
        Rev på viltkamera
      {/if}
    </div>
    <div class="buttons">
      <button
        class="button"
        class:selected={selectedAnimal === "eagle"}
        on:click={() => handleAnimalSelection("eagle")}>Ørn</button
      >
      <button
        class="button"
        class:selected={selectedAnimal === "marten"}
        on:click={() => handleAnimalSelection("marten")}>Mår</button
      >
      <button
        class="button"
        class:selected={selectedAnimal === "fox"}
        on:click={() => handleAnimalSelection("fox")}>Rev</button
      >
    </div>
  </div>
</header>
<main>
  {#each months as month}
    {#if monthData[month]}
      {#await monthData[month] then data}
        {#if month in monthData && data}
          {#if data.prefix === selectedAnimal && data.data.length > 0}
            <div class="month">
              <h2>{norskNavn}, {formatMonth(month)}</h2>
              <p class="text"><b>Tidspunkt med flest triggere:</b></p>
              {#each findHoursWithMostEvents(data.data) as hour}
                <span>kl {hour}</span>
              {/each}
              <div class="graph {selectedAnimal}">
                <Graph data={data.data} />
              </div>
            </div>
          {/if}
        {/if}
      {/await}
    {/if}
  {/each}
</main>

<style>
  @import url("https://fonts.googleapis.com/css2?family=Kaushan+Script&display=swap");
  :global(body) {
    margin: 0;
    padding: 0;
  }
  main {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    padding: 0.5rem;
    color: #3a3a3a;
  }
  header {
    display: flex;
    align-items: center;
    flex-direction: column;
  }
  .cover {
    display: flex;
    min-height: 300px;
    width: 100%;
    justify-content: space-between;
    align-items: flex-end;
    background-size: cover;
    background-position: center;
    margin-bottom: 1rem;
  }
  @media (max-width: 600px) {
    .cover {
      min-height: 180px;
    }
  }
  .cover.marten {
    background-image: url("//dev.blaauw.photo/marten/marten.jpg");
  }
  .cover.fox {
    background-image: url("//dev.blaauw.photo/marten/fox.jpg");
  }
  .cover.eagle {
    background-image: url("//dev.blaauw.photo/marten/eagle.jpg");
  }
  .heading {
    font-family: "Kaushan Script";
    font-size: 1.8rem;
    color: #ffffff;
    padding: 0.5rem;
    line-height: 1;
  }
  .text {
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
    text-align: center;
  }
  .graph {
    width: 100%;
    
    overflow-y: hidden;
  }
  h2 {
    margin: 0.25em 0;
    font-size: 1.2em;
    font-weight: 800;
    text-transform: uppercase;
  }
  .buttons {
    display: flex;
    margin: 0.5rem;
  }
  .button {
    margin: 0 0.25rem;
    padding: 6px 12px;
    font-size: 14px;
    font-weight: bold;
    text-align: center;
    text-decoration: none;
    background-color: #fff;
    color: #222;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    opacity: 0.8;
  }
  .button:last-child {
    margin-right: 0;
  }

  .selected {
    opacity: 1;
  }

  .button:hover {
    background-color: #d3d3d3;
    opacity: 0.9;
  }

  .button:active {
    background-color: #fff;
  }


</style>

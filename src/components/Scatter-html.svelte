<!--
	@component
	Generates an HTML scatter plot. This component can also work if the x- or y-scale is ordinal, i.e. it has a `.bandwidth` method. See the [timeplot chart](https://layercake.graphics/example/Timeplot) for an example.
 -->
<script>
  import { getContext } from "svelte";

  const { data, xGet, yGet, xScale, yScale } = getContext("LayerCake");

  let popupTime = '';

  function extractTime(dateTimeString) {
    // Split the date and time parts
    const [datePart, timePart] = dateTimeString.split(' ');
    // Extract time part
    const [hours, minutes] = timePart.split(':');
    return `kl ${hours}:${minutes}`;
  }

  function handleMouseOver(event, d) {
    showPopup(event, d);
  }

  function handleFocus(event, d) {
    showPopup(event, d);
  }

  function showPopup(event, d) {
    popupTime = extractTime(d.timestring);
    const dot = event.target;
    const popup = dot.nextElementSibling;
    popup.style.display = 'block';
  }

  function handleMouseOut() {
    hidePopups();
  }

  function handleBlur() {
    hidePopups();
  }

  function hidePopups() {
    const popups = document.querySelectorAll('.popup');
    popups.forEach(popup => popup.style.display = 'none');
  }


  /** @type {Number} [r=5] – The circle's radius. */
  export let r = 6;

  /** @type {String} [fill='#0cf'] – The circle's fill color. */
  export let fill = "rgba(150, 100, 60, 0.6)";

  /** @type {String} [stroke='#000'] – The circle's stroke color. */
  export let stroke = "rgba(150, 100, 60, 0.9)";

  /** @type {Number} [strokeWidth=1] – The circle's stroke width. */
  export let strokeWidth = 1;

  
</script>

<div class="scatter-group">
  {#each $data as d}
    <div
      class="circle"
      on:mouseover={(event) => handleMouseOver(event, d)}
      on:mouseout={handleMouseOut}
      on:focus={(event) => handleFocus(event, d)}
      on:blur={handleBlur}
      tabindex="0"
      style="
				left: {$xGet(d) + ($xScale.bandwidth ? $xScale.bandwidth() / 2 : 0)}%;
				top: {$yGet(d) + ($yScale.bandwidth ? $yScale.bandwidth() / 2 : 0)}%;
				width: {r * 2}px;
				height: {r * 2}px;
				background-color: {fill};
				border: {strokeWidth}px solid {stroke};
			"
    />
    <div class="popup" style="
				left: calc({$xGet(d) + ($xScale.bandwidth ? $xScale.bandwidth() / 2 : 0)}% - 35px);
				top: calc({$yGet(d) + ($yScale.bandwidth ? $yScale.bandwidth() / 2 : 0)}% - 30px);
			">
      {popupTime}
    </div>
  {/each}
</div>

<style>
  .circle {
    position: absolute;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    mix-blend-mode: multiply;
  }
  .popup {
    position: absolute;
    font-family: -apple-system, -apple-system, BlinkMacSystemFont, "Segoe UI",
      Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue",
      sans-serif;
    width: 70px;
    text-align: center;
    display: none;
    padding: 0.2em 0.5em;
    font-size: 0.8rem;
    color: #555;
    font-weight: 600;
    background: #f2f2f2;
    border-radius: 0.25em;
    z-index: 999;
    border: 1px solid #d2d2d2;
  }
</style>

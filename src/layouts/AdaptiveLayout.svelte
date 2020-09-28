<!-- 
  COMPONENT JAVASCRIPT 
-->
<script>
// SVELTE imports
import { onMount } from 'svelte';
//
import { createEventDispatcher } from 'svelte';
const dispatch = createEventDispatcher();

// WIDGETIC Components
import Style from "Components/Style.svelte";

// WIDGET Local Components
import GridGallery from ".././components/GridGallery.svelte";

// COMPONENT properties
export let skin;
export let content;
//
export let layout;
export let disabled;

// LOCAL properties
let listOpen = false;

// DOM elements references
let headerDiv;
let contentDiv;
let statusDiv;

// REACTIVE(computed) properties
$:contentCount = content.length;
$:titleText = content[0] ? content[0].titleText : "";
$:elementsPadding = skin.elementsPadding;
let contentHeight = 0;

/*
  COMPONENT METHODS
*/
/* COMPONENT MOUNT - start point */
onMount(async () => {
});

/* COMPONENT RESIZE */
function onResize(event) {
  // console.log("onResize!", contentDiv.clientHeight);
  contentHeight = listOpen ? contentDiv.clientHeight : 0;
}

function onArrowClick() {
  listOpen = !listOpen;
  onResize();
  dispatch('resize');
}

export function cHeight() {
  // console.log("cHeight");
  return headerDiv ? (
    headerDiv.clientHeight +
    (listOpen && content.length ? (elementsPadding + contentDiv.clientHeight) : 0) +
    (listOpen && statusDiv.clientHeight > 0 ? (elementsPadding + statusDiv.clientHeight) : 0)
  ) : 0;
}

</script>


<!-- 
  COMPONENT CSS 
-->
<Style css="{`

  .header {
    justify-content: space-between;
  }

  .title {

  }

  .arrow-container {
    display: flex;
    justify-content: center;
    flex-direction: column;

    pointer-events: ${disabled ? 'none' : 'auto'};

    overflow: hidden;

    min-width: 99px;
    height: 38px;

    border-radius: 5px;
    background-color: rgba(201,205,207,0.2);

    cursor: pointer;
    margin-left: ${elementsPadding}px;
  }
  .arrow-emoji-samples {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    height: ${listOpen ? 0 : 38}px;
    transition: height 250ms ease;
  }
  .arrow-emoji {
    margin: 0px 0px 0px 5px !important;
  }

  .voted-item-level {
    position: absolute;
    width: 0%;
    height: 100%;
    left:0;
    z-index: 0;
    transition: all 600ms ease;
    pointer-events: none;
    background-color: ${skin.votesSecondaryColor};
  }

  .voted-item-percent {
    width: 40px;
    font-family: ${skin.textFont.family};
    font-size: ${skin.textFont.size-4}px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.4;
    letter-spacing: normal;
    text-align: center;
    color: ${skin.textColor};
    margin-left: 5px;
    z-index: 2;
  }

  .arrow {
    height: 12px;

    margin: 13px 5px;

    transition: 250ms ease all;
    z-index: 3;
  }

  .arrow-up {
    transform: rotate(180deg);
    height: ${listOpen ? 16 : 0}px;
    transition: height 250ms ease;
    margin: ${listOpen ? 11 : 0}px;
  }


  .content-holder {
    height: ${contentHeight}px;
    transition: all 250ms ease;
  }

  .emoji-item {
    padding: 10px;
    border-radius: 5px;
  }

  .emoji-text-ct {
    margin-left: 10px;
  }
`}">
</Style>

<!-- 
  COMPONENT HTML 
-->
<svelte:window on:resize={onResize}/>
<div class="header" bind:this={headerDiv}>
  <div class="title">{@html titleText || ""}</div>
  <div class="arrow-container" on:click={onArrowClick}>
    <svg class="arrow-up" viewBox="0 0 284.929 284.929">
      <use xlink:href="#icon-arrow-down"/>
    </svg>

    <div class="arrow-emoji-samples">

      {#each content.slice(0,3) as item}
        {#if item.emojiIcon}
        <img class="arrow-emoji emoji-icon" alt="" src="{item.emojiIcon}"/>
        {/if}
      {/each}

      <svg xmlns="http://www.w3.org/2000/svg" style="display:none">
        <symbol id="icon-arrow-down" width="284.929px" height="284.929px" viewBox="0 0 284.929 284.929">
          <path d="M282.082,76.511l-14.274-14.273c-1.902-1.906-4.093-2.856-6.57-2.856c-2.471,0-4.661,0.95-6.563,2.856L142.466,174.441
            L30.262,62.241c-1.903-1.906-4.093-2.856-6.567-2.856c-2.475,0-4.665,0.95-6.567,2.856L2.856,76.515C0.95,78.417,0,80.607,0,83.082
            c0,2.473,0.953,4.663,2.856,6.565l133.043,133.046c1.902,1.903,4.093,2.854,6.567,2.854s4.661-0.951,6.562-2.854L282.082,89.647
            c1.902-1.903,2.847-4.093,2.847-6.565C284.929,80.607,283.984,78.417,282.082,76.511z"/>
        </symbol>
      </svg>
      <svg class="arrow" viewBox="0 0 284.929 284.929">
        <use xlink:href="#icon-arrow-down"/>
      </svg>
    </div>
  </div>
</div>

<!-- CONTENT component -->
<div class="content-holder">
  <GridGallery
  bind:content
  {skin}
  {layout}
  bind:contentDiv
  bind:disabled
  on:itemClick={(event) => {
    dispatch('resize');
    dispatch('itemClick', event.detail);
  }}/>
</div>

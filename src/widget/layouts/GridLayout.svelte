<svelte:window on:resize={onResize}/>
<script>
// svelte imports
import { onMount } from 'svelte';
//
import { createEventDispatcher } from 'svelte';
const dispatch = createEventDispatcher();

// Widgetic Services
import container from "Services/container";

// Widgetic Components
import Style from "Components/Style.svelte";

// Widget local components
import GridGallery from ".././components/GridGallery.svelte";

// properties from outside
export let skin;
export let content;
export let layout;
export let disabled;

// local properties

// elements references
let headerDiv;
let contentDiv;
let statusDiv;

// reactive(computed) properties
$:contentCount = content.length;
$:titleText = content[0] ? content[0].titleText : "";
$:elementsPadding = skin.elementsPadding;
let contentHeight;

onMount(async () => {
  // console.log("GridLayout:");
});

function onResize(event) {
  // console.log("onResize!", contentDiv.clientHeight);
  contentHeight = contentDiv ? contentDiv.clientHeight : 0;
}

export function cHeight() {
  // console.log("cHeight");
  return headerDiv ? (
    headerDiv.clientHeight +
    (content.length ? elementsPadding  + contentDiv.clientHeight : 0) +
    ((statusDiv.clientHeight > 0 ? elementsPadding : 0) + statusDiv.clientHeight)
  ) : 0;
}

</script>



<Style css="{`

  .header {
    justify-content: center;
  }

  .title {

  }

  .content-holder {
    height: ${contentHeight}px;
  }

  .emoji-item {
    flex-direction: column;
    padding: 15%;
  }

  .emoji-icon {
    width:  50px !important;
    height:  50px !important;
    margin-bottom: 15%;
  }

  .emoji-text-ct {
    justify-content: center;
    text-align: center;
  }

  .emoji-percent {
    text-align: center;
  }

`}">
</Style>

<div class="header" bind:this={headerDiv}>
  <div class="title">{@html titleText || ""}</div>
</div>

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

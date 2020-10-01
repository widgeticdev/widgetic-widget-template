<!-- 
  COMPONENT JAVASCRIPT 
-->
<script>
// SVELTE imports
import { onMount } from 'svelte';
//
import { createEventDispatcher } from 'svelte';
const dispatch = createEventDispatcher();

// WIDGETIC Services
import container from "Services/container";

// WIDGETIC Components
import Style from "Components/Style.svelte";

// WIDGET Local components
import ContentGallery from "../components/ContentGallery.svelte";


// COMPONENT properties
export let skin;
export let content;
//
export let layout;
export let disabled;


// LOCAL properties

// DOM elements references
let headerDiv;
let contentDiv;
let statusDiv;

// REACTIVE(computed) properties
$:contentCount = content.length;
$:titleText = content[0] ? content[0].titleText : "";
$:elementsPadding = skin.elementsPadding;
let contentHeight;

/*
  COMPONENT METHODS
*/
/* COMPONENT MOUNT - start point */
onMount(async () => {
  // console.log("GridLayout:");
});

/* COMPONENT RESIZE */
function onResize(event) {
  // console.log("onResize!", contentDiv.clientHeight);
  contentHeight = contentDiv ? contentDiv.clientHeight : 0;
}

export function cHeight() {
  // console.log("cHeight");
  return headerDiv ? (
    headerDiv.clientHeight +
    (content.length ? (elementsPadding + (contentDiv ? contentDiv.clientHeight:0)) : 0) +
    ((statusDiv && statusDiv.clientHeight ? elementsPadding : 0) + (statusDiv && statusDiv.clientHeight ? statusDiv.clientHeight : 0))
  ) : 0;
}

</script>


<!-- 
  COMPONENT CSS 
-->
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

<!-- 
  COMPONENT HTML 
-->
<svelte:window on:resize={onResize}/>

<div class="header" bind:this={headerDiv}>
  <div class="title">{@html titleText || ""}</div>
</div>

<!-- CONTENT component -->
<div class="content-holder">
  <ContentGallery
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

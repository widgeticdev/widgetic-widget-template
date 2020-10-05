<!-- 
  COMPONENT JAVASCRIPT 
-->
<script>
// SVELTE imports
import { onMount } from 'svelte';
//
import { createEventDispatcher } from 'svelte';
const dispatch = createEventDispatcher();

// THIRD PARTY services
import tinycolor from "tinycolor2";

// WIDGETIC Components imports
import Style from "Components/Style.svelte";
import ContentItem from "./ContentItem.svelte";


// COMPONENT properties
export let wWidth;
export let wHeight;
//
export let skin;
export let content;
//
export let layout;
//
export let disabled;

// REACTIVE(computed) properties
$:titleFont = skin.textFont.family;
$:titleSize = Math.max(skin.textFont.size - 2, 0);
$:titleColor = skin.textColor;
// items properties
$:itemBackFillHoverColor = tinycolor(skin.itemHoverColor).setAlpha(0.4);

// DOM elements references
export let contentDiv;

/*
  COMPONENT METHODS
*/
// COMPONENT MOUNT - start point
onMount(async () => {
  // console.log("GridGallery onMount");
});

// COMPONENT RESIZE
function onResize(event) {
  // console.log("GALLERY RESIZE:", contentDiv ? contentDiv.clientHeight : -1);
}

function onItemClick(event) {
  // console.log("gallery onItemClick:", event);

  dispatch('itemClick', event);
}

function allItemsNoText(pContent) {
  for(let i = 0; i < pContent.length; i++) {
    // console.log("allItemsNoText item text:", pContent[i].buttonText == undefined);
    if(pContent[i].buttonText != undefined && pContent[i].buttonText != '') return false;
  }
  // console.log("allItemsNoText TRUE");
  return true;
}

</script>


<!-- 
  COMPONENT CSS 
-->
<Style css="{`
  .content-container {
    display: ${layout == "grid" ? 'grid' : 'flex'};

    grid-template-columns: repeat(auto-fit, minmax(126px, 1fr));
    grid-gap: ${skin.itemsPadding}px;

    flex-direction: column;

    overflow: hidden;
  }

  .emoji-item {
    position: relative;
    display: flex;
    align-items: center;

    height: auto;

    overflow: hidden;

    background-color: ${skin.itemFillColor};

    transition: all 250ms ease;

    cursor: pointer;
  }

  .emoji-item:hover, .emoji-item:hover .emoji-stroke {
    background-color: ${skin.itemFillHoverColor};
    border-color: ${skin.itemStrokeHoverColor};
  }

  .emoji-level {
    position: absolute;
    left: 0;
    z-index: 0;
    transition: all 600ms ease;
    pointer-events: none;
  }

  .emoji-stroke {
    position: absolute;
    left: 0;
    right:0;
    top: 0;
    bottom: 0;
    box-sizing: border-box;
    pointer-events: none;
    border: ${skin.itemStrokeSize}px solid ${skin.itemStrokeColor};
  }

  .emoji-icon {
    width:20px;
    height:20px;

    object-fit: contain;

    user-select:none;
    pointer-events: none;
    z-index: 1;
  }

  .emoji-text-ct {
    display: flex;
    flex-direction: column;
    z-index: 2;
    white-space: nowrap;
    overflow: hidden;
    color: ${skin.itemTextColor};

    font-family: ${titleFont};
    font-size: ${titleSize}px;
  }

  .emoji-text {
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.59;
    letter-spacing: normal;
    user-select:none;
  }

  .emoji-percent {
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.4;
    letter-spacing: normal;
    user-select:none;
  }
`}">
</Style>


<!-- 
  COMPONENT HTML 
-->
<svelte:window bind:innerWidth={wWidth} bind:innerHeight={wHeight} on:resize={onResize}/>
<div class="content-container" bind:this={contentDiv}>
  {#each content as item}
    <ContentItem {item} {skin} bind:disabled on:click = {(event) => dispatch('itemClick', event)} />
  {/each}
</div>

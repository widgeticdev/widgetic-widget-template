<svelte:window bind:innerWidth={wWidth} bind:innerHeight={wHeight} on:resize={onResize}/>
<script>
// svelte imports
import { onMount } from 'svelte';
//
import { createEventDispatcher } from 'svelte';
const dispatch = createEventDispatcher();

// Services
import container from "Services/container";

// Widgetic Components
import Style from "Components/Style.svelte";

// third party libraries
import tinycolor from "tinycolor2";

// properties from outside
export let wWidth;
export let wHeight;
//
export let skin;
export let content;
export let layout;
//
export let itemClicked;
export let disabled;
export let totalVotersNo;
export let contentDiv;

// elements references

// local properties

// reactive(computed) properties
$:titleFont = skin.textFont.family;
$:titleSize = Math.max(skin.textFont.size - 2, 0);
$:titleColor = skin.textColor;
// items properties
$:itemBackFillHoverColor = tinycolor(skin.itemHoverColor).setAlpha(0.4);


onMount(async () => {
  // console.log("GridGallery onMount:", itemClicked);
});

/*
  WIDGET METHODS
*/
function onResize(event) {
  // console.log("GALLERY RESIZE:", contentDiv ? contentDiv.clientHeight : -1);
}

function allItemsNoText(pContent) {
  for(let i = 0; i < pContent.length; i++) {
    // console.log("allItemsNoText item text:", pContent[i].buttonText == undefined);
    if(pContent[i].buttonText != undefined && pContent[i].buttonText != '') return false;
  }
  // console.log("allItemsNoText TRUE");
  return true;
}

function allItemsNoVotes(pContent) {
  for(let i = 0; i < pContent.length; i++) {
    // console.log("allItemsNoVotes item text:", pContent[i].noVotes == undefined);
    if(pContent[i].noVotes != undefined && pContent[i].noVotes != '') return false;
  }

  return true;
}

function onItemClick(event) {
  // console.log("gallery onItemClick:", event);

  // itemClicked = true;

  dispatch('itemClick', event);
}

</script>

<Style css="{`
  .content-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(${allItemsNoText(content) && allItemsNoVotes(content) ? 40 : 126}px, 1fr));
    grid-gap: ${skin.itemsPadding}px;

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

<div class="content-container" bind:this={contentDiv}>
  {#each content as item}
    <div class="emoji-item"
         style="justify-content: {item.buttonText && item.emojiIcon ? 'flex-start' : 'center'};
                pointer-events:  {itemClicked || disabled ? 'none' : 'auto'};"
         on:click="{(event) => onItemClick(item)}">

      <div class="emoji-level"
           style="top:    {layout == "adaptive" ? 0 : (100 - (itemClicked ? Math.round((item.noVotes * 100) / totalVotersNo) : 0))}%;
                  width:  {layout == "adaptive" ? (itemClicked ? Math.round((item.noVotes * 100) / totalVotersNo) : 0) : 100}%;
                  height: {layout != "adaptive" ? (itemClicked ? Math.round((item.noVotes * 100) / totalVotersNo) : 0) : 100}%;
                  background-color: {item.currentVote ? skin.votesSecondaryColor : skin.votesPrimaryColor};"></div>

      {#if item.emojiIcon}
      <img class="emoji-icon" alt="" src="{item.emojiIcon}"/>
      {/if}

      <div class="emoji-text-ct" style="display: {!item.buttonText && !item.noVotes ? 'none' : 'block'}">
        <div class="emoji-text" style="display: {item.buttonText && skin.displayLabel ? 'block' : 'none'}">{@html item.buttonText || ""}</div>
        <div class="emoji-percent" style="display: {item.noVotes && itemClicked && !isNaN(item.noVotes) && totalVotersNo ? 'block' : 'none'}">{skin.displayPercentage ? Math.round((item.noVotes * 100) / totalVotersNo) + '%' : item.noVotes}</div>
      </div>

      <div class="emoji-stroke"></div>

    </div>
  {/each}
</div>

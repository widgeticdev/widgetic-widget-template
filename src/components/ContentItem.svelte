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


// COMPONENT properties
export let skin;
export let item;
export let layout;
//
export let disabled;
export let totalVotersNo;

$:percentLevel = item.noVotes && totalVotersNo ? Math.round((item.noVotes * 100) / totalVotersNo) : 0;

</script>


<!-- 
  COMPONENT CSS 
-->



<!-- 
  COMPONENT HTML 
-->

<div class="emoji-item"
      style="justify-content: {item.buttonText && item.emojiIcon ? 'flex-start' : 'center'};
            pointer-events:  {disabled ? 'none' : 'auto'};"
      on:click="{(event) => dispatch('click', item)}">

  <div class="emoji-level"
  style="opacity: {disabled ? 1 : 0};
         top:    {layout == "adaptive" ? 0 : (100 - percentLevel)}%;
         width:  {layout == "adaptive" ? percentLevel : 100}%;
         height: {layout != "adaptive" ? percentLevel : 100}%;
         background-color: {skin.itemStrokeColor};"></div>

  {#if item.emojiIcon}
  <img class="emoji-icon" alt="" src="{item.emojiIcon}"/>
  {/if}

  <div class="emoji-text-ct" style="display: {!item.buttonText && !item.noVotes ? 'none' : 'block'}">
    <div class="emoji-text" style="display: {item.buttonText && skin.displayLabel ? 'block' : 'none'}">{@html item.buttonText || ""}</div>
    <div class="emoji-percent" style="opacity: {disabled ? 1 : 0}">{percentLevel}%</div>
  </div>

  <div class="emoji-stroke"></div>

</div>

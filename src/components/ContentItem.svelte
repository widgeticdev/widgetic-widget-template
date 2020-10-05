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
//
export let disabled;

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
      on:click="{(event) => dispatch('click', event)}">

  {#if item.emojiIcon}
  <img class="emoji-icon" alt="" src="{item.emojiIcon}"/>
  {/if}

  <div class="emoji-text-ct" style="display: {!item.buttonText && !item.noVotes ? 'none' : 'block'}">
    <div class="emoji-text" style="display: {item.buttonText && skin.displayLabel ? 'block' : 'none'}">{@html item.buttonText || ""}</div>
  </div>

  <div class="emoji-stroke"></div>

</div>

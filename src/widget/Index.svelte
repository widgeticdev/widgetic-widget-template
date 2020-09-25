<!-- WIDGET JAVASCRIPT -->
<script>
// SVELTE imports
import { onMount } from 'svelte';
import { createEventDispatcher } from 'svelte';
const dispatch = createEventDispatcher();
import { fade } from "svelte-transitions";

// THIRD PARTY imports
import tinycolor from "tinycolor2";

// WIDGETIC Services
import container from "Services/container";

// WIDGETIC Components
import Style from "Components/Style.svelte";
import DotsLoader from "Components/DotsLoader.svelte";

// WIDGET local Components
// import GridGallery from "./components/GridGallery.svelte";

/* WIDGET PROPERTIES */
// dimensions
export let wWidth;
export let wHeight;

// skin and content
export let skin;
export let content;

/* WIDGET LAYOUTS COMPONENTS */
// adaptive layout - for mobile(mandatory)
import AdaptiveLayout from "./layouts/AdaptiveLayout.svelte";

// your layouts - for desktop(at least one)
import GridLayout     from "./layouts/GridLayout.svelte";
// import ListLayout     from "./layouts/ListLayout.svelte";


/* REACTIVE(computed) properties */
// current selected layout
$:layout = isAdaptive ? "adaptive" : (skin.layout ? skin.layout : "grid");
let prevLayout;
// layouts list
const layoutMap = {
  adaptive: AdaptiveLayout,
  grid: GridLayout
};
// current selected layout component
$:layoutComponent = layoutMap[layout];
let isAdaptive = false;


// widget properties
$:widgetBackgroundColor = skin.backgroundColor ? skin.backgroundColor : 'rgba(255,255,255,1)';
let prevWidgetPadding;
$:widgetPadding = skin.widgetPadding;
let prevElementsPadding;
$:elementsPadding = skin.elementsPadding;
let prevBorderSize;
$:borderSize = skin.borderSize ? skin.borderSize : 0;
$:borderRadius = skin.borderRadius ? skin.borderRadius : 0;
$:borderColor = skin.borderColor ? skin.borderColor : 'rgba(255,255,255,1)';

// text properties
let prevTitleText;
$:titleText = content[0] ? content[0].titleText : "";
let prevTitleFont;
$:titleFont = skin.textFont.family;
let prevTitleSize;
$:titleSize = skin.textFont.size;
$:titleColor = skin.textColor;

// content items properties
let prevItemsPadding;
$:itemsPadding = skin.itemsPadding;
let prevItemStrokeSize;
$:itemStrokeSize = skin.itemStrokeSize;

// widget data properties
let compositionId;
let factsArray = [];
let loading = true;

// content
let prevContent;
let prevContentCount;
$:contentCount = content.length;

// fonts css
let fontsCss;

// dom elements references
let mainComponent;

/* WIDGET ON UPDATE */
$: {
  // resize mainComponent when title, font, content, border or padding changes
  if(prevLayout != layout ||
    prevContentCount != contentCount ||
    prevContent != content ||
    prevItemsPadding != itemsPadding ||
    prevBorderSize != borderSize ||
    prevWidgetPadding != widgetPadding ||
    prevElementsPadding != elementsPadding ||
    prevTitleText != titleText ||
    prevTitleFont != titleFont ||
    prevTitleSize != titleSize ||
    prevItemStrokeSize != itemStrokeSize) {
    // console.log("ON UPDATE prevContentCount:", layout);
    onResize('update');
  }
  prevLayout = layout;
  prevContentCount = contentCount;
  prevContent = content;
  prevItemsPadding = itemsPadding;
  prevBorderSize = borderSize;
  prevWidgetPadding = widgetPadding;
  prevElementsPadding = elementsPadding;
  prevTitleText = titleText;
  prevTitleFont = titleFont;
  prevTitleSize = titleSize;
}


/* WIDGET MOUNT */
onMount(async () => {
  // read fonts from the container
  container.Fonts.updates.listen(css => {
    fontsCss = css;
    // console.log("FONTS updated:", fontsCss);
  });

  // read adaptive from the container
  // console.log("Widget onMount adaptive value:", container.adaptive);
  isAdaptive = container.Adaptive.isOnAdaptive;
  container.Adaptive.updates.listen(isOnAdaptive => {
    // console.log("isOnAdaptive:", isOnAdaptive)
    isAdaptive = isOnAdaptive;
  });


  // read composition id from metadata
  compositionId = container.metadata && container.metadata.composition ? container.metadata.composition.id : "";
  // console.log("widget onMount compositionId from meta:", compositionId);


  // read data(facts) for current composition
  readWidgetData();
});


/*
  WIDGET INTERNAL METHODS
*/
function readWidgetData() {
  // console.log("readWidgetData");
  loading = true;
  // console.log("Read facts for composition:", container.metadata.composition.id);
  // container.Fact.readFacts(container.metadata.composition.id).then((res) => {
  container.Fact.readFacts().then(
    (res) => {
      // read the facts
      // console.log("FACTS read result:", res.result);
      factsArray = res.result;

      // resize the main component
      onResize('main-component');

      // hide loader and show elements
      loading = false;
    },
    (err) => {
      console.log("FACTS read error:", {err}.err.message);
      loading = false;
    }
  );
}

function deleteVotesWidthVoteId(voteId) {
  // console.log("Delete facts for composition:", container.metadata.composition.id);

  // show loader
  loading = true;

  container.Fact.deleteFactsWidth("voteid", voteId).then(
    (res) => {
      // delted facts
      console.log("FACTS deleted result:", res);

      // hide loader and show elements
      loading = false;
    },
    (err) => {
      console.log("FACTS deleted error:", {err}.err.message);
      loading = false;
    }
  );
}

function onItemClick(event) {
  
  // show loader
  loading = true;

  // create a new fact to save the vote of the selected option
  container.Fact.create({ voteid:event.detail.id })
  .then(
    (res) => {
      // console.log("did create the fact:", res);

      // read again the data to update the new number
      readWidgetData();
    },
    (err) => {
      console.log("Fact create error:", {err}.err.message);
      loading = false;
    }
  );

  // container.Fact.delete("5e909891eb44a4ef733ffe18").then(
  //   (res) => {
  //     console.log("delete the fact:", res);
  //   });
}

function onResize(event) {
  setTimeout(() => {
    // console.log("onResize:", event);

    // calculate the widget height
    let widgetHeight = 2 * widgetPadding +
                       (mainComponent && mainComponent.cHeight ? mainComponent.cHeight() : 0) +
                       2 * borderSize;
    // console.log("WIDGET RESIZE:", event, widgetHeight);

    // set autoscale height
    // console.log("container.Autoscale:", widgetHeight, container.Autoscale);
    if (widgetHeight > 0) container.Autoscale.setHeight(widgetHeight);
  }, 120);
}

/*
  WIDGET GENERAL METHODS for EDITOR
*/
export function addContent(item) {
  // console.log("Widget MainComponent: item that was added:", item);
}

export function removeContent(item) {
  // console.log("Widget MainComponent: item that was deleted:", item.id);

  // delete all data(from the database) of this item that was removed
  deleteVotesWidthVoteId(item.id);
}

export function clearContent() {
  // console.log("all Content was deleted!", content);

  // reset votes array
  // factsArray = [];

  // delete all facts from the database for this composition
  // deleteFacts();
}

export function on(eventName, handler) {
  // console.log("Widget on:", eventName);
}

/*
  WIDGET PUBLIC METHODS
*/
export function publicFunction1(param) {
  console.log("publicFunction1", param)
}

export function publicFunction2(param) {
  console.log("publicFunction2", param)
}

export function isAutoscalable() {
  return container.Autoscale.autoscale;
}

</script>

<!-- WIDGET CSS -->

<Style css="{`
  .widget-root {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width:  calc(100% - ${2 * (skin.widgetPadding + borderSize)}px);
    height: calc(100% - ${2 * (skin.widgetPadding + borderSize)}px);
    background-color: ${widgetBackgroundColor};
    outline: 0;
    padding: ${skin.widgetPadding}px;
    border-radius: ${borderRadius}px;
    border: solid ${borderSize}px ${borderColor};
    overflow: hidden;
  }

  .header {
    display:flex;
    align-items: center;
    overflow: hidden;
    margin-bottom: ${elementsPadding}px;
  }

  .title {
    font-family: ${skin.textFont.family};
    font-size: ${skin.textFont.size}px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.4;
    letter-spacing: normal;
    text-align: center;
    color: ${skin.textColor};
  }

  .content-holder {
    overflow: hidden;
  }

  ${fontsCss}
`}">
</Style>


<!--
  WIDGET HTML TEMPLATE
-->

<!-- WINDOW ELEMENT -->
<svelte:window 
bind:innerWidth={wWidth} bind:innerHeight={wHeight} 
on:resize={() => onResize('widget')}/>

<!-- WIDGET MAIN HOLDER -->
<div class="widget-root">
  
  <!-- LAYOUT component-->
  <svelte:component
    this={layoutComponent} bind:this={mainComponent}
    {skin}
    bind:content
    {layout}
    {titleText}
    bind:disabled={loading}
    on:resize={() => onResize('main-component')}
    on:itemClick={(event) => onItemClick(event)}/>
  
</div>

<!-- WIDGET LOADER -->
{#if loading}
<span transition:fade>
  <DotsLoader color={widgetBackgroundColor} />
</span>
{/if}
<!-- 
  WIDGET JAVASCRIPT 
-->
<script>
// SVELTE imports
import { onMount } from 'svelte';

// THIRD PARTY services
// import tinycolor from "tinycolor2";

// THIRD PARTY Components
// import { Button } from 'svelte-mui';

// WIDGETIC Services in container: Fonts, Adaptive, Autoscale
import container from "Services/container";
let dataStore = container.Data;

// WIDGETIC Components
import Style from "Components/Style.svelte";
import DotsLoader from "Components/DotsLoader.svelte";

/* WIDGET LAYOUTS COMPONENTS */
// adaptive layout - for mobile(mandatory)
import AdaptiveLayout from "./layouts/AdaptiveLayout.svelte";

// your layouts - for desktop(at least one)
import GridLayout     from "./layouts/GridLayout.svelte";
// import ListLayout     from "./layouts/ListLayout.svelte";

// layouts list
const layoutList = {
  adaptive: AdaptiveLayout,
  grid: GridLayout,
//list: ListLayout
};

// current selected layout from theme
let isAdaptive = false;
$:layout = isAdaptive || !skin.layout ? "adaptive" : skin.layout;
let prevLayout;

// current layout component
$:layoutComponent = layoutList[layout];

/* WIDGET LOCAL COMPONENTS */
// import GridGallery from "./components/GridGallery.svelte";


/* WIDGET PROPERTIES */
// dimensions
export let wWidth;
export let wHeight;

// skin(theme) and content
export let skin; // theme
export let content;

/* WIDGET REACTIVE(computed) properties */

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


/* WIDGET LOCAL PROPERTIES */
// content
let prevContent;
let prevContentCount;
$:contentCount = content.length;

// DATA(saved) properties
let compositionId;
let usersDataArray = [];
let loading = false;

// fonts css object
let fontsCss;

// DOM elements references
let mainComponent;


/* WIDGET PROPERTIES UPDATE */
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

/***
  WIDGET METHODS
***/

/* WIDGET MOUNT - start point */
onMount(async () => {

  /* WIDGETIC SERVICES init code here */
  // listen to Fonts Service updates to update fonts CSS
  container.Fonts.updates.listen(css => {
    fontsCss = css; // console.log("FONTS updated:", fontsCss);
  });

  // read Adaptive Service updates to know when widget goes in adaptive layout
  // console.log("Widget onMount adaptive value:", container.adaptive);
  isAdaptive = container.Adaptive.isOnAdaptive;
  container.Adaptive.updates.listen(isOnAdaptive => {
    isAdaptive = isOnAdaptive; // console.log("isOnAdaptive:", isOnAdaptive)
  });
  

  /* YOUR INIT CODE here */

  // read current collected end-users data
  // - needed for read/write widgets that must collect data from end-user
  // - remove it for read only widgets
  readWidgetData()
});

/* WIDGET RESIZE */
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

// READ END-USERS DATA
function readWidgetData() {
  // console.log("readWidgetData");
  loading = true;
  
  // read all votes
  dataStore.readAllData().then(
    (res) => {
      // read the facts
      // console.log("USERS DATA results:", res.result);
      usersDataArray = res.result;

      // resize the main component
      onResize('main-component');

      // hide loader and show elements
      loading = false;
    },
    (err) => {
      console.log("USERS DATA read error:", {err}.err.message);
      loading = false;
    }
  );
}

// SAVE END-USERS DATA
// here you define the property name("voteid")
// here you pass the property value(contentItemId)
function saveUserVoteForItem(contentItemId) {
  // console.log("Save vote for contentItemId:", contentItemId);
  
  // show loader
  loading = true;

  // save the user's vote for the clicked option(content item)
  dataStore.saveData({ voteid: contentItemId }).then(
    (res) => {
      // console.log("did create the data:", res);
      // hide loader
      loading = false;

      // read again the data to update the number of votes
      readWidgetData();
    },
    (err) => {
      console.log("Fact create error:", {err}.err.message);

      // hide loader
      loading = false;
    }
  );
}

// DELETE END-USERS DATA
function deleteAllVotesForItem(contentItemId) {
  // console.log("Delete user data for composition:", container.metadata.composition.id);

  // show loader
  loading = true;

  // delete all votes for the removed content item
  dataStore.deleteDataWithProperty("voteid", contentItemId).then(
    (res) => {
      // delted data records
      console.log("DATA deleted result:", res);

      // hide loader
      loading = false;
    },
    (err) => {
      console.log("DATA deleted error:", {err}.err.message);
      loading = false;
    }
  );
}




/*
  WIDGET PUBLIC CONTENT METHODS for EDITOR
*/
export function addContent(item) {
  // console.log("Widget MainComponent: item that was added:", item);
}

export function removeContent(item) {
  // console.log("Widget MainComponent: item that was deleted:", item.id);

  // delete all data(from the database) for this item that was removed
  deleteAllVotesForItem(item.id);
}

export function clearContent() {
  // console.log("all Content was deleted!", content);

  // reset votes array
  // usersDataArray = [];

  // delete all facts from the database for this composition
  // deleteFacts();
}

export function on(eventName, handler) {
  // console.log("Widget on:", eventName);
}

/*
  WIDGET PUBLIC(API) METHODS
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


<!-- 
  WIDGET CSS 
-->
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
  WIDGET HTML
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
    on:itemClick={(event) => saveUserVoteForItem(event.detail.id)}/>
  
</div>

<!-- WIDGET LOADER -->
<DotsLoader color={widgetBackgroundColor} visible={loading} />
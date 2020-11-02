import WidgetBase from '@widgetic/components/widget';
import MainComponent from './Index.svelte';

export default class Widget extends WidgetBase {
  getComponent() {
    // console.log("getComponent:", this);

    // post message to parent window to pubish the events and mothods
    window.parent.postMessage(JSON.stringify({
      t: 'widgetPublicMethodsAndEvents', 
      id: window.name, 
      d: {
        compositionId: this.metadata.composition.id, 
        publicMethods: this.getPublicMethods(), 
        publicEvents: this.getPublicEvents()
      }
    }), '*');

    return MainComponent;
  }

  // widget's api public functions
  getPublicMethods() {
    return ['publicFunction1', 'publicFunction2', 'play'];
  }

  // widget's api public events
  getPublicEvents() {
    return ['event1', 'event2', 'startPlaying']; // 'startPlaying' for media players only
  }
}


/**
 * This file is used by webpack to output the live build of the widget
 *
 * DO NOT CHANGE THIS
 */
var modules = {};
modules[WIDGET_NAME] = function(exports, require, module) {
  module.exports = Widget;
};
// console.log("WIDGET MODULES:", modules);
window.require.define(modules);
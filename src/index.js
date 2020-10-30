import WidgetBase from '@widgetic/components/widget';
import MainComponent from './Index.svelte';

export default class Widget extends WidgetBase {
  getComponent() {
    return MainComponent;
  }

  // widget's api public functions
  getPublicMethods() {
    return ['publicFunction1', 'publicFunction2', 'play'];
  }

  // widget's api public events
  getPublicEvents() {
    return ['event1', 'event2', 'startPlaying'];
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
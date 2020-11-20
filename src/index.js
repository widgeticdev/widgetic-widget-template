import WidgetBase from '@widgetic/components/widget';
import MainComponent from './Index.svelte';

export default class Widget extends WidgetBase {

  // widget's public api methods
  getPublicMethods() {
    return ['methodExample', 'voteItemNo'];
  }

  // widget's public api events
  getPublicEvents() {
    return ['evExample', 'didVote'];
  }

  
  
  // getter for Main Svelte Component
  getComponent() {
    return MainComponent;
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
import WidgetBase from '@widgetic/components/widget';
import MainComponent from './Index.svelte';

// define the declarative map of properties for dynamic content
import { config } from 'Services/container';
config.constant('declarativeMap', {
  image: 'src',
  imageDescription: 'alt',
});

export default class Widget extends WidgetBase {
  getComponent() {
    return MainComponent;
  }

  // widget's api public functions
  getPublicMethods() {
    return ['publicFunction1', 'publicFunction2'];
  }

  // widget's api public events
  getPublicEvents() {
    return ['init', 'beforeChange', 'afterChange'];
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

window.require.define(modules);